import WeekendCard from "./WeekendCard";
import { WEEKEND_CARD } from "../../data";
import "./Weekend.css";

export default function Weekend() {
  return (
    <section className="weekend-deals">
      <h2>Weekend deals you’ll love</h2>
      <p>Save on stays for 7 March - 9 March</p>

      <div>
        <div className="weekend-card">
          {WEEKEND_CARD.map((weekendCard) => (
            <WeekendCard key={weekendCard.title} {...weekendCard} />
          ))}
        </div>
      </div>
    </section>
  );
}
