package com.finsight.controller;

import com.finsight.entity.RecurringTransaction;
import com.finsight.entity.User;
import com.finsight.repository.RecurringTransactionRepository;
import com.finsight.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recurring")
@CrossOrigin("*")
public class RecurringTransactionController {

    private final RecurringTransactionRepository recurringRepository;
    private final UserRepository userRepository;

    public RecurringTransactionController(
            RecurringTransactionRepository recurringRepository,
            UserRepository userRepository) {

        this.recurringRepository = recurringRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/{email}")
    public RecurringTransaction addTransaction(
            @PathVariable String email,
            @RequestBody RecurringTransaction transaction) {

        User user = userRepository.findByEmail(email).get();

        transaction.setUser(user);

        return recurringRepository.save(transaction);
    }

    @GetMapping("/{email}")
    public List<RecurringTransaction> getTransactions(
            @PathVariable String email) {

        User user = userRepository.findByEmail(email).get();

        return recurringRepository.findByUser(user);
    }

    @DeleteMapping("/{id}")
    public String deleteTransaction(@PathVariable Long id) {

        recurringRepository.deleteById(id);

        return "Recurring Transaction Deleted";
    }
}