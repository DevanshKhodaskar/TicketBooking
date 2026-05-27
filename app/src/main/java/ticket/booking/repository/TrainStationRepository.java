package ticket.booking.repository;

import ticket.booking.entities.TrainStation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainStationRepository extends JpaRepository<TrainStation, Integer> {
    List<TrainStation> findByTrainTrainIdOrderByStationSequence(String trainId);
}
