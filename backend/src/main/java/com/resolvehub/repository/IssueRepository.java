package com.resolvehub.repository;

import com.resolvehub.entity.Issue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IssueRepository extends JpaRepository<Issue, Long> {
    List<Issue> findByReporterIdOrderByCreatedAtDesc(Long reporterId);
    List<Issue> findAllByOrderByCreatedAtDesc();
}
