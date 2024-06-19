import Institutions from './components/instututions'

export const EditInstitution = () => {
  return (
    <div class="p-6 animate-fade-in">
      <img
        class="hover:-translate-y-0.5 transition-transform hover:opacity-80 h-6 "
        src="/icons/modify.svg"
        alt="modify icon"
        id="modify-institution-icon"
      />
      <Institutions />
      <div class="flex flex-col text-font-off-white font-semibold text-lg mt-8 justify-center items-center">
            <a href="">
              <button class="hover:-translate-y-0.5 transition-all bg-accent-blue rounded-3xl w-72 py-[0.5rem] mt-4">
                Add a new institution
              </button>
            </a>
          </div>
    </div>
  )
}

export default EditInstitution
