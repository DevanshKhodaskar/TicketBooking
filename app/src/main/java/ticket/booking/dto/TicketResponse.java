package ticket.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketResponse {
    private String ticketId;
    private TrainSummary train;
    private SeatSummary seat;
    private String source;
    private String destination;
    private LocalDate dateOfTravel;
    private String ticketStatus;
    private LocalDateTime createdAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TrainSummary {
        private String trainId;
        private String trainNo;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SeatSummary {
        private String seatId;
        private String seatNumber;
    }
}