import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Mail, Code2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import GeneratedContentDialog from "@/components/leads/GeneratedContentDialog";

export default function LeadActions({ lead }) {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState(Mail);
  const [content, setContent] = useState("");

  const demoUrl = `https://demo.higginsd.com/${(lead.business_name || "demo")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;

  const generateEmail = async () => {
    setOpen(false);
    setTitle("Personalized Outreach Email");
    setIcon(Mail);
    setDialogOpen(true);
    setLoading(true);
    setContent("");
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Write a personalized cold outreach email from Davis Higgins, the founder of Higgins Digital.

ABOUT HIGGINS DIGITAL:
Higgins Digital builds websites for businesses whose website is either nonexistent or doesn't reflect the quality of their work. They specialize in generating responsive, modern, and custom platforms that increase company visibility and significantly improve online presence.

TARGET BUSINESS:
- Business Name: ${lead.business_name}
- Industry/Category: ${lead.category}
- Location: ${lead.location}
- Phone: ${lead.phone || "N/A"}
- Rating: ${lead.rating || "N/A"} stars (${lead.review_count || 0} reviews)
- Has Website: ${lead.has_website ? "Yes" : "No"}
- Website Score: ${lead.website_score || 0}/100
- Audit Problems Found: ${lead.audit_problems || "N/A"}
- Suggested Service: ${lead.suggested_service}
- Outreach Angle: ${lead.audit_outreach_angle || "N/A"}

EMAIL REQUIREMENTS:
1. From Davis Higgins, founder of Higgins Digital
2. Reference specific details about THIS business (their industry, location, rating/reviews, and what was found during the website audit)
3. Explain that Higgins Digital builds websites for businesses whose current website is either nonexistent or doesn't reflect the quality of their work
4. Mention that you went ahead and created a demo website for them. Include this link: ${demoUrl}
5. Ask if they'd be interested and have time for a quick 10-15 minute call to go over the website, pricing, and next steps
6. Keep it professional but warm and human — it should NOT sound like an automated template. Vary the sentence structure, use natural transitions, and make it feel like one person writing to another
7. Be concise — no longer than 4-5 short paragraphs
8. Do NOT use spammy language, excessive exclamation marks, or generic marketing buzzwords
9. The subject line should be specific to the business, not generic

Output ONLY the email, starting with "Subject:" on the first line, then a blank line, then the email body.`,
        response_json_schema: {
          type: "object",
          properties: {
            email: { type: "string" }
          }
        }
      });
      setContent(result.email || "Could not generate email. Please try again.");
    } catch {
      setContent("Could not generate email. Please try again.");
    }
    setLoading(false);
  };

  const generatePrompt = async () => {
    setOpen(false);
    setTitle("Claude Code Website Build Prompt");
    setIcon(Code2);
    setDialogOpen(true);
    setLoading(true);
    setContent("");
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate a detailed prompt that someone could paste into Claude Code (an AI coding assistant) to build a complete, professional business website for the following business. Use ALL the business details below to make the prompt comprehensive.

BUSINESS DETAILS (from Google Maps):
- Business Name: ${lead.business_name}
- Industry/Category: ${lead.category}
- Location: ${lead.location}
- Phone: ${lead.phone || "N/A"}
- Google Maps Link: ${lead.google_maps_link || "N/A"}
- Rating: ${lead.rating || "N/A"} stars
- Review Count: ${lead.review_count || 0} reviews
- Has Existing Website: ${lead.has_website ? "Yes" : "No"}
- Existing Website URL: ${lead.website_url || "None"}
- Website Score: ${lead.website_score || 0}/100
- Audit Findings: ${lead.audit_problems || "N/A"}
- Recommended Service: ${lead.suggested_service}

The prompt should instruct Claude Code to:
1. Build a modern, responsive, multi-page business website using React + Tailwind CSS
2. Include all relevant pages for this type of business (Home, About, Services, Gallery/Portfolio, Contact, etc.)
3. Use the business's actual name, phone, location, and industry to create realistic content for every section
4. Create a compelling hero section that speaks to their specific industry and target customers
5. Build a services section tailored to their industry (e.g., a roofing company would have roof repair, roof replacement, storm damage, etc.)
6. Include a contact form with fields relevant to the business type
7. Add an interactive Google Maps embed showing their location
8. Display their rating and reviews prominently as social proof
9. Include an FAQ section relevant to their industry
10. Make it mobile-first and fast-loading
11. Use a color scheme appropriate for their industry
12. Include SEO meta tags, schema markup for LocalBusiness, and Open Graph tags
13. Add a sticky navigation bar and a professional footer with their contact info
14. Include placeholder images from Unsplash relevant to their industry using specific search terms

Output ONLY the prompt text, ready to paste into Claude Code. Make it detailed and specific to this exact business.`,
        response_json_schema: {
          type: "object",
          properties: {
            prompt: { type: "string" }
          }
        }
      });
      setContent(result.prompt || "Could not generate prompt. Please try again.");
    } catch {
      setContent("Could not generate prompt. Please try again.");
    }
    setLoading(false);
  };

  return (
    <>
      <div className="relative">
        <Button
          size="sm"
          variant="outline"
          className="text-xs h-7 gap-1"
          onClick={() => setOpen(!open)}
        >
          <ChevronDown size={12} /> Actions
        </Button>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <div className="absolute right-0 top-full mt-1 z-50 w-56 bg-white rounded-lg border shadow-lg py-1">
              <button
                onClick={generateEmail}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 text-left transition-colors"
              >
                <Mail size={14} className="text-amber-500" />
                Generate Outreach Email
              </button>
              <button
                onClick={generatePrompt}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 text-left transition-colors"
              >
                <Code2 size={14} className="text-[#0d1b2a]" />
                Claude Code Website Prompt
              </button>
            </div>
          </>
        )}
      </div>
      <GeneratedContentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={title}
        icon={icon}
        loading={loading}
        content={content}
      />
    </>
  );
}
