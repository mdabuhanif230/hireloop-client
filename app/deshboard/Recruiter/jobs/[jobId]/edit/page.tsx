import { JobEditForm } from "@/components/dashboard/recruiter/job-edit-form"

export default async function EditRecruiterJobPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params
  return <JobEditForm jobId={jobId} />
}
