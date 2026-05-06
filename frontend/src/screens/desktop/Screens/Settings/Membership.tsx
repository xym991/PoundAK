import { useEffect, useState, useMemo } from "react";
import cn from "@/utils/classname";
import { useSelector } from "react-redux";
import axios from "@/utils/axios";

type TebexPackage = {
  id: number;
  name: string;
  price: string;
  description: string;
  category: string;
};

const Package = ({
  name,
  price,
  description,
  current,
  popular,
  onClick,
}: {
  name: string;
  price: string;
  description: string;
  current?: boolean;
  popular?: boolean;
  onClick?: () => void;
}) => {
  return (
    <div
      className={cn(
        "_package",
        current ? "current" : "",
        popular ? "popular-tier" : ""
      )}
    >
      {popular && <div className="popular">MOST POPULAR</div>}
      <h2>{name.toUpperCase()}</h2>
      <h1 className="price text-orange-500">{price}</h1>
      <ul className="perks">
        {description.split("|").map((perk, i) => (
          <li key={i}>{perk.trim()}</li>
        ))}
      </ul>
      <button className="action" onClick={onClick} disabled={current}>
        {current ? "Current" : "Join"}
      </button>
    </div>
  );
};

const Membership = () => {
  const volume = useSelector((state: any) => state.volume);
  const [packages, setPackages] = useState<TebexPackage[]>([]);
  const currentTier = "solo";

  const audio = useMemo(() => {
    const a = new Audio("/assets/audio/light-tick.aac");
    a.volume = volume;
    return a;
  }, [volume]);

  useEffect(() => {
    overwolf.profile.getCurrentUser((profileResult: any) => {
      if (!profileResult.success) return;

      const userId = profileResult.userId;

      overwolf.profile.generateUserSessionToken((tokenResult: any) => {
        if (!tokenResult.success) return;

        const token = tokenResult.token;
        const storeId = "xxv5-b5fad86abf9851ef333024d563a9e5db080a4880";
        const extensionId = "gialagiimclbmihcbgafcafepjlhjmjnhomjpmpn";

        const url = `https://subscriptions-api.overwolf.com/packages/${storeId}?extensionId=${extensionId}`;

        axios
          .get(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            setPackages((packages: any) => {
              return packages.map((pkg: any) => {
                res.data.forEach((item: any) => {
                  if (pkg.name.toLowerCase() === item.name.toLowerCase()) {
                    pkg.id = item.id;
                    pkg.price = item.base_price;
                    pkg.info = item.description;
                  }
                });
                return pkg;
              });
            });
          })
          .catch((err) => {
            console.error(
              "Subscriptions API error:",
              err.response?.data || err.message
            );
          });
      });
    });
  }, []);

  useEffect(() => {
    const mockData: TebexPackage[] = [
      {
        id: 1,
        name: "Solo",
        price: "Free",
        description: "Ad-supported access|Limited AI coaching|Daily XP",
        category: "POUND AK Subscriptions",
      },
      {
        id: 2,
        name: "Guided",
        price: "$3.99",
        description: "Ad-free|Unlimited basic coaching|XP Boost",
        category: "POUND AK Subscriptions",
      },
      {
        id: 3,
        name: "Coached",
        price: "$7.99",
        description: "Full AI coaching|Analytics dashboard|Exclusive perks",
        category: "POUND AK Subscriptions",
      },
    ];
    setPackages(mockData);
  }, []);

  const openTebexCheckout = (packageId: number) => {
    overwolf.profile.getCurrentUser((profileResult: any) => {
      if (!profileResult.success) return;

      const userId = profileResult.uuid;
      const storeId = "xxv5-b5fad86abf9851ef333024d563a9e5db080a4880";
      const extensionId = "gngbkedhljnomdiifgaciojdmnpckikpjmnnadgm";

      const url = `https://subscriptions-api.overwolf.com/checkout/${storeId}/${packageId}?extensionId=${extensionId}&userId=${userId}`;

      //redirects to this "https://www.overwolf.com/pages/subscriptions/subscribe-error.html"

      overwolf.utils.openUrlInDefaultBrowser(url);
    });
  };

  return (
    <div className="_settings-page">
      <h2>Membership</h2>
      <div className="page-buttons"></div>

      <div className="main flex items-center justify-center gap-2">
        {packages.map((pkg) => (
          <Package
            key={pkg.id}
            name={pkg.name}
            price={pkg.price}
            description={pkg.description}
            current={currentTier === pkg.name.toLowerCase()}
            popular={pkg.name.toLowerCase() === "guided"}
            onClick={() => pkg.id != 1 && openTebexCheckout(pkg.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Membership;
