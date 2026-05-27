package ticket.booking.controller;

import ticket.booking.dto.TicketResponse;
import ticket.booking.service.TicketService;
import ticket.booking.dto.ApiResponse;
import ticket.booking.dto.BookingRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tickets")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @PostMapping("/book")
    public ResponseEntity<ApiResponse<TicketResponse>> bookTicket(@RequestBody BookingRequest request) {
        try {
            TicketResponse ticket = ticketService.bookTicket(request);
            return ResponseEntity.ok(new ApiResponse<>(true, "Ticket booked successfully", ticket));
        } catch (Exception ex) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, ex.getMessage(), null));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<TicketResponse>>> getUserTickets(@PathVariable String userId) {
        try {
            List<TicketResponse> tickets = ticketService.getUserTickets(userId);
            return ResponseEntity.ok(new ApiResponse<>(true, "User tickets retrieved", tickets));
        } catch (Exception ex) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, ex.getMessage(), null));
        }
    }

    @GetMapping("/{ticketId}")
    public ResponseEntity<ApiResponse<TicketResponse>> getTicket(@PathVariable String ticketId) {
        try {
            TicketResponse ticket = ticketService.getTicketById(ticketId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Ticket retrieved", ticket));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Ticket not found", null));
        }
    }

    @DeleteMapping("/{ticketId}")
    public ResponseEntity<ApiResponse<String>> cancelTicket(@PathVariable String ticketId) {
        try {
            ticketService.cancelTicket(ticketId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Ticket cancelled successfully", ticketId));
        } catch (Exception ex) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, ex.getMessage(), null));
        }
    }
}
