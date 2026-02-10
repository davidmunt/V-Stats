package com.vstats.vstats.presentation.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonAnyGetter;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaginatedResponse<T> {
    private List<T> data;
    private String keyName;

    @JsonAnyGetter
    public Map<String, List<T>> getDynamicContent() {
        return Map.of(keyName != null ? keyName : "content", data);
    }

    private long total;
    private int page;
    private int total_pages;
    private Map<String, Object> filters_applied;
    private String sort;
}