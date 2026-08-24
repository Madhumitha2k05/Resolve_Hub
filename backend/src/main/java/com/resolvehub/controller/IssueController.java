package com.resolvehub.controller;

import com.resolvehub.entity.Issue;
import com.resolvehub.repository.IssueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/issues")
@CrossOrigin(origins = "*")
public class IssueController {

    @Autowired
    private IssueRepository issueRepository;

    @PostMapping
    public ResponseEntity<Issue> reportIssue(@RequestBody Issue issue) {
        Issue savedIssue = issueRepository.save(issue);
        return ResponseEntity.ok(savedIssue);
    }

    @GetMapping
    public ResponseEntity<List<Issue>> getAllIssues() {
        return ResponseEntity.ok(issueRepository.findAllByOrderByCreatedAtDesc());
    }

    @GetMapping("/reporter/{userId}")
    public ResponseEntity<List<Issue>> getIssuesByReporter(@PathVariable Long userId) {
        return ResponseEntity.ok(issueRepository.findByReporterIdOrderByCreatedAtDesc(userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Issue> updateIssue(@PathVariable Long id, @RequestBody Issue updateData) {
        return issueRepository.findById(id).map(existingIssue -> {
            if (updateData.getStatus() != null) {
                existingIssue.setStatus(updateData.getStatus());
            }
            if (updateData.getPriority() != null) {
                existingIssue.setPriority(updateData.getPriority());
            }
            if (updateData.getAssignee() != null) {
                existingIssue.setAssignee(updateData.getAssignee());
            }
            return ResponseEntity.ok(issueRepository.save(existingIssue));
        }).orElse(ResponseEntity.notFound().build());
    }
}
