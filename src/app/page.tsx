import Image from 'next/image';

export default function Home() {
    const TOTAL_SLOTS = 3;
    const certifications = [
        {
            name: 'Certified Kubernetes Administrator',
            file: '/certs/CKA_Cert.pdf',
            image: '/kubernetes-cka.svg',
        },
    ];

    const slots = [
        ...certifications,
        ...Array(Math.max(0, TOTAL_SLOTS - certifications.length)).fill(null),
    ] as Array<{
        name: string;
        file: string;
        image: string;
    } | null>;

    return (
        <section className="space-y-10">
            {/* ---------- About Me ---------- */}
            <div className="card p-8 border-0">
                <h2 className="text-2xl font-bold mb-4 flex justify-center">About Me</h2>
                <div className="grid md:grid-cols-1 gap-8">
                    <div>
                        <p className="text-lg leading-relaxed mb-4">
                            Hi! I'm a recent computer science graduate with Python development and
                            machine/deep learning project experience. A Certified Kubernetes Administrator
                            with basic GCP exposure, comfortable with Git and Docker on Linux, I'm
                            seeking an entry level software engineering or DevOps role where I can grow
                            and ship reliable code.
                        </p>
                    </div>
                </div>
            </div>

            {/* ---------- Education ---------- */}
            <div className="card p-8 border-0">
                <h2 className="text-2xl font-bold mb-4 flex justify-center">Education</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <p className="text-lg leading-relaxed mb-4 flex justify-center">
                            School: University of Alabama at Birmingham
                        </p>
                        <div className="flex justify-center">
                            <ol className="list-decimal list-inside flex flex-col items-center space-y-2">
                                <li>Masters of Science in Computer Science</li>
                                <li>Bachelors of Science in Computer Science</li>
                            </ol>
                        </div>
                    </div>
                    <div>
                        <p className="text-lg leading-relaxed mb-4 flex justify-center">
                            Placeholder
                        </p>
                    </div>
                </div>
            </div>

            {/* ---------- Certifications ---------- */}
            <section className="card p-6 md:p-8 border-0">
                <h2 className="text-2xl font-bold mb-6 dark:text-dark-text flex justify-center">Certifications</h2>

                <div className="flex justify-center">
                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-15">
                        {slots.map((cert, idx) =>
                            cert ? (
                                <li
                                    key={idx}
                                    className="bg-white dark:bg-dark-card rounded-lg shadow p-4 w-[200px] h-[200px]"
                                >
                                    {/* <li key={idx} className="bg-blue-300 dark:bg-dark-card rounded-lg shadow p-4 w-[200px] h-[200px]"> */}
                                    <a
                                        href={cert.file}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block"
                                    >
                                        <figure className="flex flex-col items-center">
                                            <Image
                                                src={cert.image}
                                                alt={cert.name}
                                                width={120}
                                                height={120}
                                                className="object-contain mb-2"
                                            />
                                            <figcaption className="text-center font-medium text-gray-800 dark:text-dark-text">
                                                {cert.name}
                                            </figcaption>
                                        </figure>
                                    </a>
                                </li>
                                // </li>
                            ) : (
                                <li
                                    key={idx}
                                    className="bg-gray-100 dark:bg-gray-700 rounded-lg shadow p-4 w-[200px] h-[200px] flex flex-col items-center justify-center"
                                >
                                    <div className="w-24 h-24 bg-gray-300 dark:bg-gray-600 rounded mb-2" />
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        Coming Soon
                                    </span>
                                </li>
                            )
                        )}
                    </ul>
                </div>
            </section>

            {/* ---------- Résumé Download ---------- */}
            {/* ... */}
        </section >
    );
}

//             {/* Resume Download Section */}
//             <section className="card p-6 md:p-8 text-center">
//                 <h2 className="text-2xl font-bold mb-4 dark:text-dark-text">My Résumé</h2>
//                 <p className="mb-6 dark:text-dark-text">Download my résumé to learn more about my professional experience and skills.</p>
//                 <a
//                     href="/Resume.pdf"
//                     download
//                     className="inline-block bg-primary hover:bg-secondary text-white font-bold py-3 px-6 rounded-lg transition-colors"
//                 >
//                     Download Résumé (PDF)
//                 </a>
//             </section>

{/* <p className="text-lg dark:text-dark-text">
    Feel free to reach out to me at{' '}
    <a href="mailto:vaishakkmenon@gmail.com" className="font-medium">
        vaishakkmenon@gmail.com
    </a>
</p> */}