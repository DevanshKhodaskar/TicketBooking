package ticket.booking.repository;

import ticket.booking.entities.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, String> {
    List<Ticket> findByUserUserId(String userId);
    List<Ticket> findByRunTrainTrainId(String trainId);
    boolean existsByRunRunIdAndSeatSeatIdAndTicketStatus(
            String runId,
            String seatId,
            Ticket.TicketStatus ticketStatus
    );
    List<Ticket> findByRunRunIdAndTicketStatus(String runId, Ticket.TicketStatus ticketStatus);
}
