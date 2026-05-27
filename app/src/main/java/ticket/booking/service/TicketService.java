package ticket.booking.service;

import ticket.booking.dto.TicketResponse;
import ticket.booking.entities.Ticket;
import ticket.booking.entities.Train;
import ticket.booking.entities.TrainRun;
import ticket.booking.entities.TrainSeat;
import ticket.booking.entities.TrainStation;
import ticket.booking.entities.User;
import ticket.booking.repository.TicketRepository;
import ticket.booking.repository.TrainRunRepository;
import ticket.booking.repository.TrainSeatRepository;
import ticket.booking.repository.TrainStationRepository;
import ticket.booking.repository.UserRepository;
import ticket.booking.repository.TrainRepository;
import ticket.booking.dto.BookingRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TrainRepository trainRepository;

    @Autowired
    private TrainSeatRepository trainSeatRepository;

    @Autowired
    private TrainRunRepository trainRunRepository;

    @Autowired
    private TrainStationRepository trainStationRepository;


    @Transactional
    public TicketResponse bookTicket(BookingRequest request) throws Exception {
        Optional<User> user = userRepository.findById(request.getUserId());
        if (user.isEmpty()) {
            throw new Exception("User not found");
        }



        Optional<Train> train = trainRepository.findById(request.getTrainId());
        if (train.isEmpty()) {
            throw new Exception("Train not found");
        }

        if (request.getDateOfTravel() == null) {
            throw new Exception("Travel date is required");
        }

        if (request.getDateOfTravel().isBefore(LocalDate.now())) {
            throw new Exception("You cannot book tickets for a past travel date");
        }




        List<TrainStation> stations = trainStationRepository.findByTrainTrainIdOrderByStationSequence(train.get().getTrainId());
        if (!hasMatchingRoute(stations, request.getSource(), request.getDestination())) {
            throw new Exception("Train does not run for the selected source and destination");
        }



        String requestedSeatNumber = request.getSeatNumber() == null ? "" : request.getSeatNumber().trim();
        List<TrainSeat> seats = ensureTrainSeatsExist(train.get());
        TrainRun run = getOrCreateTrainRun(train.get(), request.getDateOfTravel());

        if (run.getRunStatus() == TrainRun.RunStatus.CANCELLED) {
            throw new Exception("Train is not available on the selected date");
        }

        if (run.getAvailableSeats() <= 0) {
            throw new Exception("No seats available");
        }




        Optional<TrainSeat> seat = requestedSeatNumber.isBlank()
                ? seats.stream()
                        .filter(trainSeat -> isSeatAvailableForRun(run.getRunId(), trainSeat))
                        .sorted(Comparator.comparing(TrainSeat::getSeatNumber))
                        .findFirst()
                : seats.stream()
                        .filter(trainSeat -> trainSeat.getSeatNumber().equalsIgnoreCase(requestedSeatNumber))
                        .findFirst();

        if (seat.isEmpty()) {
            throw new Exception(requestedSeatNumber.isBlank() ? "No seats available" : "Seat not found");
        }

        if (!isSeatAvailableForRun(run.getRunId(), seat.get())) {
            throw new Exception(requestedSeatNumber.isBlank() ? "No seats available" : "Seat is already booked for this date");
        }



        
        TrainSeat bookedSeat = seat.get();
        run.setAvailableSeats(run.getAvailableSeats() - 1);
        trainRunRepository.save(run);

        String ticketId = UUID.randomUUID().toString();
        Ticket ticket = Ticket.builder()
                .ticketId(ticketId)
                .user(user.get())
                .run(run)
                .seat(bookedSeat)
                .source(request.getSource())
                .destination(request.getDestination())
                .ticketStatus(Ticket.TicketStatus.BOOKED)
                .build();

        return toTicketResponse(ticketRepository.save(ticket));
    }

    @Transactional(readOnly = true)
    public List<TicketResponse> getUserTickets(String userId) throws Exception {
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            throw new Exception("User not found");
        }
        return ticketRepository.findByUserUserId(userId).stream()
                .map(this::toTicketResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public TicketResponse getTicketById(String ticketId) throws Exception {
        Optional<Ticket> ticket = ticketRepository.findById(ticketId);
        if (ticket.isEmpty()) {
            throw new Exception("Ticket not found");
        }
        return toTicketResponse(ticket.get());
    }

    @Transactional
    public void cancelTicket(String ticketId) throws Exception {
        Optional<Ticket> ticket = ticketRepository.findById(ticketId);
        if (ticket.isEmpty()) {
            throw new Exception("Ticket not found");
        }

        Ticket t = ticket.get();
        if (t.getTicketStatus() == Ticket.TicketStatus.CANCELLED) {
            throw new Exception("Ticket is already cancelled");
        }

        t.setTicketStatus(Ticket.TicketStatus.CANCELLED);
        ticketRepository.save(t);

        TrainRun run = t.getRun();
        run.setAvailableSeats(run.getAvailableSeats() + 1);
        trainRunRepository.save(run);
    }

    private boolean isSeatAvailableForRun(String runId, TrainSeat seat) {
        return !ticketRepository.existsByRunRunIdAndSeatSeatIdAndTicketStatus(
                runId,
                seat.getSeatId(),
                Ticket.TicketStatus.BOOKED
        );
    }

    private TrainRun getOrCreateTrainRun(Train train, java.time.LocalDate travelDate) {
        Optional<TrainRun> existingRun = trainRunRepository.findForUpdate(train.getTrainId(), travelDate);
        if (existingRun.isPresent()) {
            return existingRun.get();
        }

        TrainRun newRun = TrainRun.builder()
                .runId(UUID.randomUUID().toString())
                .train(train)
                .travelDate(travelDate)
                .availableSeats(train.getTotalSeats())
                .runStatus(TrainRun.RunStatus.SCHEDULED)
                .build();

        return trainRunRepository.save(newRun);
    }

    private List<TrainSeat> ensureTrainSeatsExist(Train train) {
        List<TrainSeat> existingSeats = trainSeatRepository.findByTrainTrainIdOrderBySeatNumberAsc(train.getTrainId());
        if (!existingSeats.isEmpty()) {
            return existingSeats;
        }

        List<TrainSeat> generatedSeats = new ArrayList<>();
        int totalSeats = train.getTotalSeats() == null ? 0 : train.getTotalSeats();

        for (int seatIndex = 0; seatIndex < totalSeats; seatIndex++) {
            generatedSeats.add(TrainSeat.builder()
                    .seatId(UUID.randomUUID().toString())
                    .train(train)
                    .seatNumber(buildSeatNumber(seatIndex))
                    .build());
        }

        return trainSeatRepository.saveAll(generatedSeats);
    }

    private boolean hasMatchingRoute(List<TrainStation> stations, String source, String destination) {
        String normalizedSource = normalizeStationName(source);
        String normalizedDestination = normalizeStationName(destination);
        int sourceIndex = -1;

        for (int index = 0; index < stations.size(); index++) {
            String stationName = normalizeStationName(stations.get(index).getStationName());
            if (sourceIndex == -1 && stationName.equals(normalizedSource)) {
                sourceIndex = index;
                continue;
            }

            if (sourceIndex != -1 && stationName.equals(normalizedDestination)) {
                return index > sourceIndex;
            }
        }

        return false;
    }

    private String normalizeStationName(String stationName) {
        return stationName == null ? "" : stationName.trim().toLowerCase();
    }

    private String buildSeatNumber(int seatIndex) {
        int seatsPerRow = 6;
        int rowNumber = (seatIndex / seatsPerRow) + 1;
        char seatLetter = (char) ('A' + (seatIndex % seatsPerRow));
        return rowNumber + String.valueOf(seatLetter);
    }

    private TicketResponse toTicketResponse(Ticket ticket) {
        return TicketResponse.builder()
                .ticketId(ticket.getTicketId())
                .train(TicketResponse.TrainSummary.builder()
                        .trainId(ticket.getRun().getTrain().getTrainId())
                        .trainNo(ticket.getRun().getTrain().getTrainNo())
                        .build())
                .seat(TicketResponse.SeatSummary.builder()
                        .seatId(ticket.getSeat().getSeatId())
                        .seatNumber(ticket.getSeat().getSeatNumber())
                        .build())
                .source(ticket.getSource())
                .destination(ticket.getDestination())
                .dateOfTravel(ticket.getRun().getTravelDate())
                .ticketStatus(ticket.getTicketStatus().name())
                .createdAt(ticket.getCreatedAt())
                .build();
    }
}
