import { projects } from '../data'
import SectionHeading from '../components/SectionHeading'
import ProjectCard from '../components/ProjectCard'

export default function Projects() {
  return (
    <section id="projects" className="section-pad">
      <div className="container-max">
        <SectionHeading title={projects.title} subtitle={projects.subtitle} />

        <div className="grid gap-6">
          {projects.items.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
