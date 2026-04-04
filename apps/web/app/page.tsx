import Navbar from '@/components/Navbar'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="bg-white min-h-screen text-gray-900">
      <Navbar />

      {/* HERO */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto text-center">

          {/* Badge */}


          {/* Headline */}
          <h1 className="font-extrabold text-5xl md:text-7xl leading-tight tracking-tight">
            Turn chaos into{" "}
            <span className="text-amber-500">clarity</span>
          </h1>

          {/* Subheading */}
          <p className="mt-8 text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            AI writes, sends, follows up, warms up your domain,
            and tracks replies — so you can book meetings without chasing leads.
          </p>



          {/* Primary CTA */}
          <div className="mt-10 flex justify-center">
            <Button size="lg" className="px-10 py-6 text-lg">
              Start Using Klaro
            </Button>
          </div>

          {/* Social Proof */}
          <p className="mt-12 text-lg text-gray-700 font-medium">
            “Cold email that actually works.”
          </p>
        </div>

        <section className="mt-14 text-center text-sm text-gray-500">
          <p>
            Built for{" "}
            <span className="font-medium text-gray-700">
              solo founders, indie hackers, and tiny SaaS teams
            </span>{" "}
            who want results without writing endless emails.
          </p>
        </section>
      </section>

      {/* FEATURE STRIP */}
      <section className="bg-gray-50 py-20 px-6 border-t border-gray-200">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">

          <div>
            <h3 className="font-semibold text-xl">AI-Personalized Outreach</h3>
            <p className="mt-3 text-gray-600">
              Every email is written uniquely for each lead — no templates, no spam.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-xl">Your Domain, Your Reputation</h3>
            <p className="mt-3 text-gray-600">
              Automatic DNS setup, SPF, DKIM, DMARC, and warm-up built in.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-xl">Fully Automated Sequences</h3>
            <p className="mt-3 text-gray-600">
              Opener → Follow-ups → Reply tracking → One clean pipeline.
            </p>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              How Klaro Works
            </h2>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              From setup to booked meetings — fully automated.
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

            {/* Step 1 */}
            <div className="rounded-2xl border border-gray-200 p-8 hover:shadow-md transition">
              <span className="inline-block text-sm font-semibold text-amber-500 mb-4">
                STEP 01
              </span>
              <h3 className="text-2xl font-semibold mb-4">
                Connect Your Domain
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Klaro sets up your domain automatically with SPF, DKIM, and DMARC, and begins warming it so your emails land safely.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl border border-gray-200 p-8 hover:shadow-md transition">
              <span className="inline-block text-sm font-semibold text-amber-500 mb-4">
                STEP 02
              </span>
              <h3 className="text-2xl font-semibold mb-4">
                Define Your Leads
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Upload leads or create your ideal customer profile. Every email is personalized — no templates, no spam.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl border border-gray-200 p-8 hover:shadow-md transition">
              <span className="inline-block text-sm font-semibold text-amber-500 mb-4">
                STEP 03
              </span>
              <h3 className="text-2xl font-semibold mb-4">
                Book Meetings Automatically
              </h3>
              <p className="text-gray-600 leading-relaxed">
                AI sends emails, follows up intelligently, tracks replies, and keeps your calendar full — hands free.
              </p>
            </div>

          </div>


          {/* <div className="mt-20 max-w-4xl mx-auto rounded-2xl border border-gray-200 bg-gray-50 p-12 text-center">
            <p className="text-gray-500 text-sm uppercase tracking-wide mb-3">
              Product Preview
            </p>
            <p className="text-xl font-medium text-gray-700">
              See Klaro in action — personalized outreach made simple
            </p>
          </div> */}

          {/* CTA */}
          {/* <div className="mt-16 flex justify-center">
            <Button size="lg" className="px-10 py-6 text-lg">
              Start Using Klaro
            </Button>
          </div> */}

          {/* Micro trust */}
          {/* <p className="mt-6 text-center text-sm text-gray-500">
            No credit card required • Start sending personalized outreach today
          </p> */}

          {/* Differentiation */}
          <p className="mt-4 text-center text-xs text-gray-400">
            Klaro is built for thoughtful, effective outbound — not mass spam tools.
          </p>

        </div>
      </section>
    </div>
  )
}