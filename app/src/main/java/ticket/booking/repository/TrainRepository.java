package ticket.booking.repository;

import ticket.booking.entities.Train;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TrainRepository extends JpaRepository<Train, String> {
    Optional<Train> findByTrainNo(String trainNo);
}
