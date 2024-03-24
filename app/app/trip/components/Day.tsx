import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Day() {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>Day 1 (Aug 23rd, 2024)</AccordionTrigger>
        <AccordionContent>
          <ul>
            <li>Hiking</li>
            <li>Visiting Musuems</li>
            <li>Snoggling</li>
            <li>Going to the beach</li>
            <li>Kayaking</li>
            <li>Watching sunrise</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
