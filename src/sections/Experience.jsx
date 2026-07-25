import { experience } from '../data'
import SectionHeading from '../components/SectionHeading'
import TimelineItem from '../components/TimelineItem'

export default function Experience() {
  return (
    <section id="experience" className="section-pad">
      <div className="container-max">
        <SectionHeading title={experience.title} subtitle={experience.subtitle} />

        <div className="space-y-6">
          {experience.items.map((item, index) => (
            <TimelineItem
              key={item.id}
              index={index}
              title={item.role}
              subtitle={`${item.company} · ${item.companyType}`}
              meta={item.location}
              period={`${item.startDate} – ${item.endDate}`}
              body={
                <ul className="mt-5 space-y-3 text-sm leading-relaxed text-muted md:text-base">
                  {item.responsibilities.map((responsibility) => (
                    <li key={responsibility} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <span>{responsibility}</span>
                    </li>
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
