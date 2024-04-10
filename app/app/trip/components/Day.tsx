import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Day({ index, date }) {
  const formattedDate = new Date(date).toLocaleDateString();

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value={`item-${index}`}>
        <AccordionTrigger>
          Day {index} ({formattedDate})
        </AccordionTrigger>
        <AccordionContent>
          <ul>
            <li>Hiking</li>
            <li>Visiting Museums</li>
            <li>Snorkeling</li>
            <li>Going to the beach</li>
            <li>Kayaking</li>
            <li>Watching the sunrise</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
