package com.finsight.repository;

import com.finsight.entity.RecurringTransaction;
import com.finsight.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecurringTransactionRepository
        extends JpaRepository<RecurringTransaction, Long> {

    List<RecurringTransaction> findByUser(User user);
}