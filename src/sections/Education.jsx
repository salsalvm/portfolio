import { education } from '../data'
import SectionHeading from '../components/SectionHeading'
import TimelineItem from '../components/TimelineItem'

export default function Education() {
  return (
    <section id="education" className="section-pad">
      <div className="container-max">
        <SectionHeading title={education.title} subtitle={education.subtitle} />

        <div className="space-y-8">
          {education.items.map((item, index) => (
            <TimelineItem
              key={item.id}
              index={index}
              title={item.degree}
              subtitle={item.institution}
              period={item.period}
              body={
                <ul className="mt-4 space-y-2 text-sm text-muted md:text-base">
                  {item.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              }
            />
          ))}
        </div>
      </div>
    </section>
  )
}
