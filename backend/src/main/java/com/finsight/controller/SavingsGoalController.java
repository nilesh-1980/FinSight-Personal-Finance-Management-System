package com.finsight.controller;

import com.finsight.entity.SavingsGoal;
import com.finsight.entity.User;
import com.finsight.repository.SavingsGoalRepository;
import com.finsight.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
@CrossOrigin("*")
public class SavingsGoalController {

    private final SavingsGoalRepository savingsGoalRepository;
    private final UserRepository userRepository;

    public SavingsGoalController(SavingsGoalRepository savingsGoalRepository,
                                 UserRepository userRepository) {
        this.savingsGoalRepository = savingsGoalRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/{email}")
    public SavingsGoal addGoal(@PathVariable String email,
                               @RequestBody SavingsGoal goal) {

        User user = userRepository.findByEmail(email).get();
        goal.setUser(user);

        return savingsGoalRepository.save(goal);
    }

    @GetMapping("/{email}")
    public List<SavingsGoal> getGoals(@PathVariable String email) {

        User user = userRepository.findByEmail(email).get();

        return savingsGoalRepository.findByUser(user);
    }

    @PutMapping("/{id}")
    public SavingsGoal updateGoal(@PathVariable Long id,
                                  @RequestBody SavingsGoal newGoal) {

        SavingsGoal oldGoal = savingsGoalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        oldGoal.setGoalName(newGoal.getGoalName());
        oldGoal.setTargetAmount(newGoal.getTargetAmount());
        oldGoal.setSavedAmount(newGoal.getSavedAmount());
        oldGoal.setDeadline(newGoal.getDeadline());

        return savingsGoalRepository.save(oldGoal);
    }

    @DeleteMapping("/{id}")
    public String deleteGoal(@PathVariable Long id) {

        savingsGoalRepository.deleteById(id);

        return "Goal Deleted Successfully";
    }
}