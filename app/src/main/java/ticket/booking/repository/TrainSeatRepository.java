package ticket.booking.repository;

import ticket.booking.entities.TrainSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TrainSeatRepository extends JpaRepository<TrainSeat, String> {
    List<TrainSeat> findByTrainTrainId(String trainId);
    List<TrainSeat> findByTrainTrainIdOrderBySeatNumberAsc(String trainId);
    Optional<TrainSeat> findByTrainTrainIdAndSeatNumber(String trainId, String seatNumber);
}
