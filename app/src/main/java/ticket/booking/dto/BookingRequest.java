package ticket.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequest {
    private String userId;
    private String trainId;
    private String seatNumber;
    private String source;
    private String destination;
    private LocalDate dateOfTravel;
}
