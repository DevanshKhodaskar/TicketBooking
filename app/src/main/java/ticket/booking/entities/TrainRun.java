package ticket.booking.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "train_runs", uniqueConstraints = {
        @UniqueConstraint(name = "unique_train_date_run", columnNames = {"train_id", "travel_date"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainRun {

    @Id
    @Column(name = "run_id")
    private String runId;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "train_id", nullable = false)
    private Train train;

    @Column(name = "travel_date", nullable = false)
    private LocalDate travelDate;

    @Column(name = "available_seats", nullable = false)
    private Integer availableSeats;

    @Enumerated(EnumType.STRING)
    @Column(name = "run_status", nullable = false)
    private RunStatus runStatus;

    @JsonIgnore
    @OneToMany(mappedBy = "run", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Ticket> tickets;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (runStatus == null) {
            runStatus = RunStatus.SCHEDULED;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum RunStatus {
        SCHEDULED, CANCELLED
    }
}