export function buildRecommendation(transfer) {
  const { confidence, reasoning, suggestedAction } = transfer;

  const confidenceLabel =
    confidence >= 0.9 ? "high" : confidence >= 0.75 ? "medium" : "low";

  const score = Math.round(confidence * 100);

  return {
    action: "approve",
    actionLabel: "APPROVE TRANSFER",
    confidence: confidenceLabel,
    score,
    suggestedAction,
    reasons: reasoning,
    context: {
      "Suggested Owner": transfer.suggestedOwner.name,
      Title: transfer.suggestedOwner.title,
      Department: transfer.suggestedOwner.department,
      "Transfer Reason": transfer.transferReason,
    },
  };
}
