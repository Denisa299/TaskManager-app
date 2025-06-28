export function AboutSection() {
  return (
    <section id="about" className="container py-24 sm:py-32 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Despre TaskManager
        </h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          TaskManager a fost creat de o echipă de dezvoltatori pasionați care au înțeles provocările managementului de
          proiecte în echipe moderne.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 text-left">
          <div className="bg-white rounded-xl p-6 shadow-soft card-hover border border-green-100">
            <h3 className="text-xl font-bold mb-2 text-green-700">Misiunea noastră</h3>
            <p className="text-muted-foreground">
              Misiunea noastră este să simplificăm managementul de proiecte și să ajutăm echipele să colaboreze mai
              eficient, indiferent de locația lor.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-soft card-hover border border-blue-100">
            <h3 className="text-xl font-bold mb-2 text-blue-700">Viziunea noastră</h3>
            <p className="text-muted-foreground">
              Ne dorim ca TaskManager să devină instrumentul esențial pentru orice echipă care dorește să-și maximizeze
              productivitatea și să-și atingă obiectivele.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-soft card-hover border border-purple-100">
            <h3 className="text-xl font-bold mb-2 text-purple-700">Valorile noastre</h3>
            <p className="text-muted-foreground">
              Simplicitate, eficiență, colaborare și inovație continuă sunt valorile care ne ghidează în dezvoltarea
              TaskManager.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-soft card-hover border border-orange-100">
            <h3 className="text-xl font-bold mb-2 text-orange-700">Echipa noastră</h3>
            <p className="text-muted-foreground">
              Suntem o echipă diversă de dezvoltatori, designeri și experți în UX dedicați creării celei mai bune
              experiențe pentru utilizatorii noștri.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
