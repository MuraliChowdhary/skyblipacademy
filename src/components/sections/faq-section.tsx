import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";
import { FAQS } from "@/src/lib/data";

export function FAQSection() {
  return (
    <section className="border-b border-border py-20 lg:py-28">
      <div className="mx-auto w-full max-w-3xl px-6 lg:px-8">
        {/* <p className="font-mono text-xs text-muted-foreground">06 · questions</p> */}
        <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">
          Answered plainly
        </h2>

        <Accordion className="mt-10">
          {FAQS.map((faq, index) => (
            <AccordionItem key={faq.q} value={`item-${index}`} className="border-border">
              <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="leading-relaxed text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
