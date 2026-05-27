package ticket.booking.service;

import ticket.booking.entities.Train;
import ticket.booking.entities.TrainRun;
import ticket.booking.entities.TrainStation;
import ticket.booking.repository.TrainRepository;
import ticket.booking.repository.TrainRunRepository;
import ticket.booking.repository.TrainStationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TrainService {

    @Autowired
    private TrainRepository trainRepository;

    @Autowired
    private TrainStationRepository trainStationRepository;

    @Autowired
    private TrainRunRepository trainRunRepository;

    public List<Train> getAllTrains() {
        return trainRepository.findAll();
    }

    public Train getTrainById(String trainId) throws Exception {
        Optional<Train> train = trainRepository.findById(trainId);
        if (train.isEmpty()) {
            throw new Exception("Train not found");
        }
        train.get().setStations(trainStationRepository.findByTrainTrainIdOrderByStationSequence(trainId));
        return train.get();
    }

    public List<Train> searchTrains(String source, String destination, LocalDate date) {
        String normalizedSource = normalizeStationName(source);
        String normalizedDestination = normalizeStationName(destination);

        if (normalizedSource.isBlank() || normalizedDestination.isBlank() || date == null) {
            return List.of();
        }

        return trainRepository.findAll().stream()
                .map(train -> {
                    List<TrainStation> stations = trainStationRepository
                            .findByTrainTrainIdOrderByStationSequence(train.getTrainId());
                    train.setStations(stations);
                    train.setAvailableSeats(resolveAvailableSeats(train, date));
                    return train;
                })
                .filter(train -> hasMatchingRoute(train.getStations(), normalizedSource, normalizedDestination))
                .filter(train -> train.getAvailableSeats() > 0)
                .toList();
    }

    private int resolveAvailableSeats(Train train, LocalDate date) {
        return trainRunRepository.findByTrainTrainIdAndTravelDate(train.getTrainId(), date)
                .filter(run -> run.getRunStatus() == TrainRun.RunStatus.SCHEDULED)
                .map(TrainRun::getAvailableSeats)
                .orElse(train.getTotalSeats());
    }

    private boolean hasMatchingRoute(List<TrainStation> stations, String source, String destination) {
        int sourceIndex = -1;

        for (int index = 0; index < stations.size(); index++) {
            String stationName = normalizeStationName(stations.get(index).getStationName());

            if (sourceIndex == -1 && stationName.equals(source)) {
                sourceIndex = index;
                continue;
            }

            if (sourceIndex != -1 && stationName.equals(destination)) {
                return index > sourceIndex;
            }
        }

        return false;
    }

    private String normalizeStationName(String stationName) {
        return stationName == null ? "" : stationName.trim().toLowerCase();
    }

    public Train createTrain(Train train) throws Exception {
        if (train.getTrainId() == null) {
            train.setTrainId(UUID.randomUUID().toString());
        }
        return trainRepository.save(train);
    }

    public Integer getAvailableSeats(String trainId, LocalDate date) throws Exception {
        Optional<Train> train = trainRepository.findById(trainId);
        if (train.isEmpty()) {
            throw new Exception("Train not found");
        }
        if (date == null) {
            return train.get().getTotalSeats();
        }
        return resolveAvailableSeats(train.get(), date);
    }

    public void updateAvailableSeats(String trainId, Integer newAvailableSeats) throws Exception {
        throw new UnsupportedOperationException("Use train runs to update date-specific availability");
    }
}
