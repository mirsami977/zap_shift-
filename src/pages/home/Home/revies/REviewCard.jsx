

const REviewCard = ({ review }) => {
  const {
    userName,
    review: reaview,
    user_photoURL: photoURL = review.userPhotoURL,
    user_email: email = review.userEmail,
  } = review;
  return (
    <div>
      <div className="max-w-md bg-[#F8F9FA] rounded-3xl p-8 shadow-sm font-sans border border-gray-100">
        {/* Quote Icon */}
        <div className="text-[#A1D6CB] mb-4">
          <svg className="w-10 h-10 fill-current" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </div>

        {/* Main Quote Text */}
        <p className="text-gray-600 text-base leading-relaxed mb-6 font-normal">
          {reaview}
        </p>

        {/* Dashed Separator Line */}
        <div className="border-b-2 border-dashed border-[#A1D6CB]/70 mb-6" />

        {/* User Info Section */}
        <div className="flex items-center gap-4">
          {/* Avatar Placeholder / Image */}
          <div className="w-12 h-12 rounded-full bg-[#024950] flex-shrink-0">
            {/* প্রোফাইল ছবি ব্যবহারের জন্য নিচের ট্যাগটি ব্যবহার করতে পারেন: */}
            <img src={photoURL} alt={userName} className="w-12 h-12 rounded-full object-cover" />
          </div>

          {/* Name and Designation */}
          <div>
            <h4 className="text-[#024950] font-bold text-lg leading-tight">
              {userName}
            </h4>
            <p className="text-gray-500 text-sm mt-0.5">
            {email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default REviewCard;
