// Profile page at /profile/[username]
// Re-exports the profile page component from /[username]
export { default } from "../../[username]/page";

// Also export getStaticPaths if needed for SSG
export const dynamicParams = true;
