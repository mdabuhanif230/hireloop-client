import { RecruiterApplicants } from "@/components/dashboard/recruiter/applicants"

export default async function JobApplicantsPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params
  return <RecruiterApplicants jobId={jobId} />
}
