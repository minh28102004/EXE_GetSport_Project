import { FiMenu } from "react-icons/fi";

const HeaderToggle: React.FC<{
  sidebarOpen: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
}> = ({ isMobile, toggleSidebar }) => {
  if (isMobile) {
    // Mobile: nút hamburger trong header
    return (
      <button
        onClick={toggleSidebar}
        className="ml-1 mb-3 p-2 rounded-xl bg-white border border-gray-200 hover:border-[#1e9ea1] hover:bg-[#1e9ea1] hover:text-white transition-all duration-200 shadow-md"
      >
        <FiMenu size={22} />
      </button>
    );
  }
};

export default HeaderToggle;
