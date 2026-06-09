package com.finsight.controller;

import com.finsight.entity.Income;
import com.finsight.entity.User;
import com.finsight.repository.IncomeRepository;
import com.finsight.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/income")
@CrossOrigin("*")
public class IncomeController {

    private final IncomeRepository incomeRepository;
    private final UserRepository userRepository;

    public IncomeController(IncomeRepository incomeRepository,
                            UserRepository userRepository) {
        this.incomeRepository = incomeRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/{email}")
    public Income addIncome(@PathVariable String email, @RequestBody Income income) {

        User user = userRepository.findByEmail(email).get();
        income.setUser(user);

        return incomeRepository.save(income);
    }

    @GetMapping("/{email}")
    public List<Income> getIncome(@PathVariable String email) {

        User user = userRepository.findByEmail(email).get();

        return incomeRepository.findByUser(user);
    }
    
    
    @PutMapping("/{id}")
    public Income updateIncome(@PathVariable Long id, @RequestBody Income newIncome) {

        Income oldIncome = incomeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Income not found"));

        oldIncome.setAmount(newIncome.getAmount());
        oldIncome.setCategory(newIncome.getCategory());
        oldIncome.setDate(newIncome.getDate());
        oldIncome.setDescription(newIncome.getDescription());

        return incomeRepository.save(oldIncome);
    }
    @DeleteMapping("/{id}")
    public String deleteIncome(@PathVariable Long id) {

        incomeRepository.deleteById(id);

        return "Income Deleted Successfully";
    }
}