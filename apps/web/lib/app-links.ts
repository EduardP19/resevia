const defaultAppUrl = "https://app.resevia.co.uk";

export const reseviaAppUrl =
  process.env.NEXT_PUBLIC_RESEVIA_APP_URL?.replace(/\/$/, "") || defaultAppUrl;

export const appDashboardUrl = `${reseviaAppUrl}/dashboard`;
export const appTestUrl = `${reseviaAppUrl}/test`;
