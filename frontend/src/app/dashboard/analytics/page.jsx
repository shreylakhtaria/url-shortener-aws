import { redirect } from 'next/navigation';

export default function AnalyticsIndexPage() {
  // Redirect to links page, as analytics requires a specific URL ID
  redirect('/dashboard/links');
}
