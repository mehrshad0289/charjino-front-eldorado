import UserProfilePage from "../../../../components/eldorado/UserProfilePage";

/* Public user profile pages (session 18, View Profile captures):
   /users/NewFloat-0una            -> Shop tab (live's default redirect target)
   /users/NewFloat-0una/shop       -> Shop tab (chip Currency active)
   /users/NewFloat-0una/reviews    -> Reviews tab (live-first content)
   /users/NewFloat-0una/about      -> About tab
   The username is accepted dynamically (the clone renders the captured
   NewFloat-0una profile for any username, like the product-single route
   renders the captured offer for any id). */

export function generateStaticParams() {
  return [
    { username: "NewFloat-0una", tab: [] },
    { username: "NewFloat-0una", tab: ["shop"] },
    { username: "NewFloat-0una", tab: ["reviews"] },
    { username: "NewFloat-0una", tab: ["about"] },
  ];
}

export async function generateMetadata({ params }) {
  const { username } = await params;
  return {
    title: `${username} - Eldorado`,
    description: `View ${username}'s profile, shop and reviews on Eldorado.`,
  };
}

export default async function UserProfileRoute({ params }) {
  const { username, tab } = await params;
  return <UserProfilePage username={username} tab={tab?.[0]} />;
}
