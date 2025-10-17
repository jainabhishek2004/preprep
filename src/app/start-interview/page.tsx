'use client';

export default async function StartInterviewPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {

  const company = (await searchParams).company;
  const round = (await searchParams).round;
  console.log("Company:", company);
  console.log("Round:", round);

  const handleClick = () => {
    // Logic to start the interview process
    alert(`Starting ${round} interview for ${company}`);
  }
  
     



  return (
    <>
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-8">Start Interview of {company}</h1>
      <p className="text-lg mb-4">This is where the {round} interview process begins.</p>
        <button
      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      onClick={handleClick}
    >
      Begin
    </button>
      
     
    
    </div>
    </>
  );
}