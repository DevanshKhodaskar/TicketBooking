package ticket.booking.repository;

import ticket.booking.entities.TrainRun;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface TrainRunRepository extends JpaRepository<TrainRun, String> {
    Optional<TrainRun> findByTrainTrainIdAndTravelDate(String trainId, LocalDate travelDate);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            select run
            from TrainRun run
            where run.train.trainId = :trainId
              and run.travelDate = :travelDate
            """)
    Optional<TrainRun> findForUpdate(@Param("trainId") String trainId, @Param("travelDate") LocalDate travelDate);
}