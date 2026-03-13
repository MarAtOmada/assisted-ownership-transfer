import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Typography,
  Chip,
  Avatar,
} from "@mui/material";
import {
  FilterBar,
  GroupHeader,
  CompactRecommendationCard,
  ActionButtons,
  useFilters,
} from "omada-prototype-toolkit";
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import transfersData from "../data/transfers.json";
import { buildRecommendation } from "../utils/recommendationEngine";

const RESOURCE_TYPE_COLORS = {
  Application: "#1565C0",
  Policy: "#6A1B9A",
  Group: "#2E7D32",
  Role: "#E65100",
  "Service Account": "#00838F",
  "Data Set": "#4527A0",
};

const reviewActions = [
  {
    key: "approved",
    label: "Approve Transfer",
    icon: <ApproveIcon fontSize="small" />,
    color: "#4CAF50",
    dialogColor: "success",
  },
  {
    key: "rejected",
    label: "Reject Transfer",
    icon: <RejectIcon fontSize="small" />,
    color: "#f44336",
    dialogColor: "error",
  },
];

const getStatusConfig = (status) => {
  switch (status) {
    case "approved":
      return { label: "Approved", color: "#4CAF50", icon: <ApproveIcon /> };
    case "rejected":
      return { label: "Rejected", color: "#f44336", icon: <RejectIcon /> };
    default:
      return null;
  }
};

const OwnerCell = ({ owner }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    <Avatar sx={{ width: 28, height: 28, fontSize: "0.75rem", bgcolor: "#002838" }}>
      {owner.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
    </Avatar>
    <Box>
      <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.2 }}>
        {owner.name}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>
        {owner.title}
      </Typography>
    </Box>
  </Box>
);

const renderTableHeaders = (visibleColumns) => (
  <TableHead>
    <TableRow sx={{ bgcolor: "rgba(0, 0, 0, 0.04)" }}>
      <TableCell padding="checkbox" sx={{ width: 48 }} />
      {visibleColumns.resourceName && (
        <TableCell sx={{ minWidth: 200 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, fontSize: "0.75rem", fontFamily: '"Graphie", "Inter", sans-serif' }}>
            RESOURCE
          </Typography>
        </TableCell>
      )}
      {visibleColumns.currentOwner && (
        <TableCell sx={{ minWidth: 180 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, fontSize: "0.75rem", fontFamily: '"Graphie", "Inter", sans-serif' }}>
            CURRENT OWNER
          </Typography>
        </TableCell>
      )}
      {visibleColumns.suggestedOwner && (
        <TableCell sx={{ minWidth: 180 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, fontSize: "0.75rem", fontFamily: '"Graphie", "Inter", sans-serif' }}>
            SUGGESTED NEW OWNER
          </Typography>
        </TableCell>
      )}
      {visibleColumns.department && (
        <TableCell sx={{ minWidth: 130 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, fontSize: "0.75rem", fontFamily: '"Graphie", "Inter", sans-serif' }}>
            DEPARTMENT
          </Typography>
        </TableCell>
      )}
      {visibleColumns.transferReason && (
        <TableCell sx={{ minWidth: 150 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, fontSize: "0.75rem", fontFamily: '"Graphie", "Inter", sans-serif' }}>
            TRANSFER REASON
          </Typography>
        </TableCell>
      )}
      {visibleColumns.status && (
        <TableCell sx={{ minWidth: 120 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, fontSize: "0.75rem", fontFamily: '"Graphie", "Inter", sans-serif' }}>
            STATUS
          </Typography>
        </TableCell>
      )}
      {visibleColumns.recommendation && (
        <TableCell sx={{ minWidth: 160 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, fontSize: "0.75rem", fontFamily: '"Graphie", "Inter", sans-serif' }}>
            AI RECOMMENDATION
          </Typography>
        </TableCell>
      )}
      <TableCell sx={{ minWidth: 120 }}>
        <Typography variant="caption" sx={{ fontWeight: 700, fontSize: "0.75rem", fontFamily: '"Graphie", "Inter", sans-serif' }}>
          ACTIONS
        </Typography>
      </TableCell>
    </TableRow>
  </TableHead>
);

export default function OwnershipTable() {
  const { filters, getSelectedIds, toggleSelection, selectAll, clearSelection } = useFilters();
  const [data, setData] = useState([]);
  const [collapsedGroups, setCollapsedGroups] = useState(new Set());

  useEffect(() => {
    const enriched = transfersData.map((item) => ({
      ...item,
      recommendation: buildRecommendation(item),
    }));
    setData(enriched);
  }, []);

  const visibleColumns = {
    resourceName: true,
    currentOwner: true,
    suggestedOwner: true,
    department: true,
    transferReason: true,
    status: true,
    recommendation: true,
  };

  const statusCounts = useMemo(() => {
    const counts = { all: data.length, pending: 0, approved: 0, rejected: 0 };
    data.forEach((item) => {
      if (item.status in counts) counts[item.status]++;
    });
    return counts;
  }, [data]);

  const filteredData = useMemo(() => {
    let result = data;
    if (filters.status !== "all") {
      result = result.filter((item) => item.status === filters.status);
    }
    if (filters.search) {
      const term = filters.search.toLowerCase();
      result = result.filter(
        (item) =>
          item.resourceName.toLowerCase().includes(term) ||
          item.currentOwner.name.toLowerCase().includes(term) ||
          item.suggestedOwner.name.toLowerCase().includes(term) ||
          item.resourceType.toLowerCase().includes(term) ||
          item.department.toLowerCase().includes(term)
      );
    }
    return result;
  }, [data, filters]);

  const groupedData = useMemo(() => {
    if (filters.groupBy === "none" || !filters.groupBy) return { "": filteredData };
    const groups = {};
    filteredData.forEach((item) => {
      const key =
        filters.groupBy === "department"
          ? item.department
          : filters.groupBy === "resourceType"
          ? item.resourceType
          : filters.groupBy === "transferReason"
          ? item.transferReason
          : item.department;
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });
    return groups;
  }, [filteredData, filters.groupBy]);

  const toggleGroupCollapse = (key) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const handleRowAction = (itemId) => (actionKey) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, status: actionKey } : item
      )
    );
    if (getSelectedIds) {
      const sel = new Set(getSelectedIds());
      sel.delete(itemId);
    }
  };

  const handleApproveSelected = () => {
    const ids = new Set(getSelectedIds());
    setData((prev) =>
      prev.map((item) =>
        ids.has(item.id) && item.status === "pending"
          ? { ...item, status: "approved" }
          : item
      )
    );
    clearSelection();
  };

  const handleRejectSelected = () => {
    const ids = new Set(getSelectedIds());
    setData((prev) =>
      prev.map((item) =>
        ids.has(item.id) && item.status === "pending"
          ? { ...item, status: "rejected" }
          : item
      )
    );
    clearSelection();
  };

  const handleApplyAllRecommendations = () => {
    setData((prev) =>
      prev.map((item) =>
        item.status === "pending" ? { ...item, status: "approved" } : item
      )
    );
    clearSelection();
  };

  const handleSelectByRecommendation = (action, confidence) => {
    const matching = filteredData.filter(
      (item) =>
        item.status === "pending" &&
        item.recommendation?.action === action &&
        item.recommendation?.confidence === confidence
    );
    selectAll(matching.map((item) => item.id));
  };

  const selectedIds = new Set(getSelectedIds ? getSelectedIds() : []);

  const renderTableRows = (items) => (
    <TableBody>
      {items.map((item) => {
        const isSelected = selectedIds.has(item.id);
        return (
          <TableRow
            key={item.id}
            hover
            selected={isSelected}
            sx={{ cursor: "pointer", "&:hover": { bgcolor: "rgba(0,40,56,0.04)" } }}
            onClick={() => toggleSelection && toggleSelection(item.id)}
          >
            <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
              <Checkbox
                checked={isSelected}
                onChange={() => toggleSelection && toggleSelection(item.id)}
                size="small"
              />
            </TableCell>

            {visibleColumns.resourceName && (
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip
                    label={item.resourceType}
                    size="small"
                    sx={{
                      bgcolor: RESOURCE_TYPE_COLORS[item.resourceType] + "18",
                      color: RESOURCE_TYPE_COLORS[item.resourceType],
                      fontWeight: 600,
                      fontSize: "0.65rem",
                      height: 20,
                    }}
                  />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {item.resourceName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.department}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
            )}

            {visibleColumns.currentOwner && (
              <TableCell>
                <OwnerCell owner={item.currentOwner} />
              </TableCell>
            )}

            {visibleColumns.suggestedOwner && (
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PersonIcon sx={{ color: "#58C1A1", fontSize: 16 }} />
                  <OwnerCell owner={item.suggestedOwner} />
                </Box>
              </TableCell>
            )}

            {visibleColumns.department && (
              <TableCell>
                <Typography variant="body2">{item.department}</Typography>
              </TableCell>
            )}

            {visibleColumns.transferReason && (
              <TableCell>
                <Chip
                  label={item.transferReason}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: "0.7rem" }}
                />
              </TableCell>
            )}

            {visibleColumns.status && (
              <TableCell>
                <Chip
                  label={item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  size="small"
                  sx={{
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    bgcolor:
                      item.status === "approved"
                        ? "#4CAF5018"
                        : item.status === "rejected"
                        ? "#f4433618"
                        : "#FF980018",
                    color:
                      item.status === "approved"
                        ? "#4CAF50"
                        : item.status === "rejected"
                        ? "#f44336"
                        : "#E65100",
                  }}
                />
              </TableCell>
            )}

            {visibleColumns.recommendation && (
              <TableCell onClick={(e) => e.stopPropagation()}>
                <CompactRecommendationCard recommendation={item.recommendation} />
              </TableCell>
            )}

            <TableCell onClick={(e) => e.stopPropagation()}>
              <ActionButtons
                actions={reviewActions}
                onAction={handleRowAction(item.id)}
                currentStatus={item.status !== "pending" ? item.status : null}
                statusConfig={getStatusConfig(item.status)}
                dialogProps={{
                  getTitle: (key) =>
                    key === "approved"
                      ? `Approve Ownership Transfer`
                      : `Reject Ownership Transfer`,
                  getDescription: (key) =>
                    key === "approved"
                      ? `This will transfer ownership of "${item.resourceName}" to ${item.suggestedOwner.name}.`
                      : `This will reject the suggested transfer of "${item.resourceName}" to ${item.suggestedOwner.name}. The resource will remain unassigned.`,
                }}
              />
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  );

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <FilterBar
        selectedCount={selectedIds.size}
        statusCounts={statusCounts}
        onSelectByRecommendation={handleSelectByRecommendation}
        onApplyAllRecommendations={handleApplyAllRecommendations}
        onApproveSelected={handleApproveSelected}
        onRejectSelected={handleRejectSelected}
        onSelectAll={() => selectAll && selectAll(filteredData.map((i) => i.id))}
        onClearSelection={() => clearSelection && clearSelection()}
      />

      <Box sx={{ flex: 1, overflow: "auto", px: 3, pb: 3, pt: 2 }}>
        {filters.groupBy && filters.groupBy !== "none" ? (
          Object.entries(groupedData).map(([groupKey, groupItems]) => {
            if (!groupKey) return null;
            const isCollapsed = collapsedGroups.has(groupKey);
            return (
              <Box key={groupKey} sx={{ mb: 3 }}>
                <GroupHeader
                  groupKey={groupKey}
                  groupType={filters.groupBy}
                  count={groupItems.length}
                  isCollapsed={isCollapsed}
                  onToggle={() => toggleGroupCollapse(groupKey)}
                />
                {!isCollapsed && (
                  <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 1 }}>
                    <Table size="small" sx={{ minWidth: 900 }}>
                      {renderTableHeaders(visibleColumns)}
                      {renderTableRows(groupItems)}
                    </Table>
                  </TableContainer>
                )}
              </Box>
            );
          })
        ) : (
          <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 1 }}>
            <Table size="small" sx={{ minWidth: 900 }}>
              {renderTableHeaders(visibleColumns)}
              {renderTableRows(filteredData)}
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
}
