package ticket.booking.controller;

import ticket.booking.entities.Train;
import ticket.booking.service.TrainService;
import ticket.booking.dto.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/trains")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class TrainController {

    @Autowired
    private TrainService trainService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Train>>> getAllTrains() {
        try {
            List<Train> trains = trainService.getAllTrains();
            return ResponseEntity.ok(new ApiResponse<>(true, "Trains retrieved", trains));
        } catch (Exception ex) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, ex.getMessage(), null));
        }
    }

    @GetMapping("/{trainId}")
    public ResponseEntity<ApiResponse<Train>> getTrain(@PathVariable String trainId) {
        try {
            Train train = trainService.getTrainById(trainId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Train retrieved", train));
        } catch (Exception ex) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, ex.getMessage(), null));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Train>>> searchTrains(
            @RequestParam String source,
            @RequestParam String destination,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            List<Train> trains = trainService.searchTrains(source, destination, date);
            return ResponseEntity.ok(new ApiResponse<>(true, "Trains found", trains));
        } catch (Exception ex) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, ex.getMessage(), null));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Train>> createTrain(@RequestBody Train train) {
        try {
            Train created = trainService.createTrain(train);
            return ResponseEntity.ok(new ApiResponse<>(true, "Train created", created));
        } catch (Exception ex) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, ex.getMessage(), null));
        }
    }

    @GetMapping("/{trainId}/available-seats")
    public ResponseEntity<ApiResponse<Integer>> getAvailableSeats(
            @PathVariable String trainId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            Integer availableSeats = trainService.getAvailableSeats(trainId, date);
            return ResponseEntity.ok(new ApiResponse<>(true, "Available seats", availableSeats));
        } catch (Exception ex) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, ex.getMessage(), null));
        }
    }
}
