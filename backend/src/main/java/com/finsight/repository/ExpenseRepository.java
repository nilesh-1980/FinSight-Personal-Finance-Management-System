package com.finsight.repository;

import com.finsight.entity.Expense;
import com.finsight.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByUser(User user);
}