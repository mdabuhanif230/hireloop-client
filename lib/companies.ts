export type Company = { slug: string; name: string; industry: string; location: string; size: string; openJobs: number; description: string; logo?: string; website: string }
export type RegisteredCompany = Company & { recruiterEmail: string; status: "Pending" | "Approved" | "Rejected"; submittedAt: string }

export const COMPANIES: Company[] = [
  { slug: "cloudscale-ai", name: "CloudScale AI", industry: "Artificial Intelligence", location: "San Francisco, CA", size: "250–500 employees", openJobs: 12, description: "CloudScale builds infrastructure monitoring and AI tools that help engineering teams understand and improve complex systems.", website: "https://cloudscale.ai" },
  { slug: "fingrid-solutions", name: "FinGrid Solutions", industry: "Fintech", location: "New York, NY", size: "51–200 employees", openJobs: 8, description: "FinGrid gives businesses clear, reliable tools for energy and financial markets.", website: "https://fingrid.solutions" },
  { slug: "creativestudio", name: "CreativeStudio", industry: "Design & Developer Tools", location: "Austin, TX", size: "11–50 employees", openJobs: 5, description: "CreativeStudio is an independent product design team working with ambitious digital companies.", website: "https://creativestudio.co" },
  { slug: "nexus-lab", name: "Nexus Lab", industry: "Developer Tools", location: "Remote, US", size: "51–200 employees", openJobs: 7, description: "Nexus Lab makes dependable tools for teams building modern cloud products.", website: "https://nexus.example.com" },
  { slug: "retail-global", name: "Retail Global", industry: "E-Commerce", location: "London, UK", size: "500–1,000 employees", openJobs: 4, description: "Retail Global helps retailers create simpler, more useful online shopping experiences.", website: "https://retail.example.com" },
  { slug: "healthai-corp", name: "HealthAI Corp", industry: "Artificial Intelligence", location: "Boston, MA", size: "201–500 employees", openJobs: 9, description: "HealthAI builds responsible software that helps clinical teams make better use of healthcare data.", website: "https://healthai.example.com" },
]
