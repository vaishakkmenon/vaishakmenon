// import Link from 'next/link';
// import Image from 'next/image';

export default function Home() {
    const certifications = [
        { name: 'Certified Kubernetes Administrator', file: '/certs/CKA_Cert.pdf' },
    ];

    return (
        <section className="space-y-10">
            {/* ---------- About Me ---------- */}
            <div className="card p-8">
                <h2 className="text-2xl font-bold mb-4">About Me</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="aspect-video">
                        <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                            <span className="text-gray-500">Image Placeholder</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-lg leading-relaxed mb-4">
                            Hi! I'm a recent computer science graduate with Python development and
                            machine/deep learning project experience. A Certified Kubernetes Administrator
                            with basic GCP exposure, comfortable with Git and Docker on Linux, I'm
                            seeking an entry level software engineering or DevOps role where I can grow
                            and ship reliable code.
                        </p>
                        <p className="text-lg dark:text-dark-text">
                            Feel free to reach out to me at{' '}
                            <a href="mailto:vaishakkmenon@gmail.com" className="font-medium">
                                vaishakkmenon@gmail.com
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </section>
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

//             {/* Certifications Section */}
//             <section className="card p-6 md:p-8">
//                 <h2 className="text-2xl font-bold mb-4 dark:text-dark-text">Certifications</h2>
//                 <ul className="list-disc pl-5 space-y-2 dark:text-dark-text">
//                     {certifications.map((cert, index) => (
//                         <li key={index}>
//                             <a
//                                 href={cert.file}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="font-medium hover:underline"
//                             >
//                                 {cert.name}
//                             </a>
//                         </li>
//                     ))}
//                 </ul>
//             </section>