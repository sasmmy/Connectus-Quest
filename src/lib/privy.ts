export function isPrivyAppIdConfigured(appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID) {
  const normalizedAppId = appId?.trim() ?? "";

  return (
    normalizedAppId.length > 20 &&
    !normalizedAppId.includes("your_") &&
    !normalizedAppId.includes("SEU_") &&
    !normalizedAppId.includes("placeholder")
  );
}
