package com.finsight.controller;

import com.finsight.entity.Budget;
import com.finsight.entity.User;
import com.finsight.repository.BudgetRepository;
import com.finsight.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budget")
@CrossOrigin("*")
public class BudgetController {

    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;

    public BudgetController(BudgetRepository budgetRepository,
                            UserRepository userRepository) {
        this.budgetRepository = budgetRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/{email}")
    public Budget addBudget(@PathVariable String email, @RequestBody Budget budget) {

        User user = userRepository.findByEmail(email).get();
        budget.setUser(user);

        return budgetRepository.save(budget);
    }

    @GetMapping("/{email}")
    public List<Budget> getBudget(@PathVariable String email) {

        User user = userRepository.findByEmail(email).get();

        return budgetRepository.findByUser(user);
    }
    @PutMapping("/{id}")
    public Budget updateBudget(@PathVariable Long id, @RequestBody Budget newBudget) {

        Budget oldBudget = budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found"));

        oldBudget.setMonth(newBudget.getMonth());
        oldBudget.setAmount(newBudget.getAmount());

        return budgetRepository.save(oldBudget);
    }

    @DeleteMapping("/{id}")
    public String deleteBudget(@PathVariable Long id) {

        budgetRepository.deleteById(id);

        return "Budget Deleted Successfully";
    }
}