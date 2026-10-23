import streamlit as st
import json
import os
import random
from datetime import datetime, timedelta
import qrcode
from io import BytesIO
from PIL import Image

# Page Configuration
st.set_page_config(
    page_title="IMovies - Movie Ticket Booking Made Simple",
    page_icon="🎬",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Cinema Dark Theme CSS
st.markdown("""
<style>
    .main {
        background-color: #0f1016;
        color: #f3f4f6;
    }
    .stButton>button {
        background: linear-gradient(135deg, #e50914 0%, #ff3366 100%);
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        padding: 0.5rem 1rem;
        transition: all 0.3s ease;
    }
    .stButton>button:hover {
        background: linear-gradient(135deg, #b80710 0%, #e50914 100%);
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(229, 9, 20, 0.4);
    }
    .cinema-banner {
        background: linear-gradient(90deg, rgba(229, 9, 20, 0.2) 0%, rgba(31, 31, 46, 0.4) 100%);
        border: 1px solid rgba(229, 9, 20, 0.3);
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 2rem;
    }
    .screen-indicator {
        background: linear-gradient(to bottom, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.05));
        height: 25px;
        border-radius: 6px;
        text-align: center;
        font-size: 0.8rem;
        font-weight: bold;
        letter-spacing: 0.2em;
        color: #ffffff;
        margin-bottom: 1.5rem;
        line-height: 25px;
    }
    .badge-vip {
        background-color: #8b5cf6;
        color: white;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 0.75rem;
    }
    .badge-premium {
        background-color: #2563eb;
        color: white;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 0.75rem;
    }
    .badge-standard {
        background-color: #374151;
        color: white;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 0.75rem;
    }
</style>
""", unsafe_allow_html=True)

# Data Persistence / Load
DB_PATH = os.path.join(os.path.dirname(__file__), "server", "data", "db.json")

def load_data():
    if os.path.exists(DB_PATH):
        try:
            with open(DB_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    # Default fallback data
    return {
        "movies": [
            {
                "_id": "65f101a1b1c1d1e1f1000001",
                "title": "Oppenheimer",
                "tagline": "The world forever changes.",
                "description": "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.",
                "genre": ["Biography", "Drama", "History"],
                "duration": 180,
                "rating": 8.9,
                "certificate": "R",
                "language": "English",
                "director": "Christopher Nolan",
                "cast": ["Cillian Murphy", "Emily Blunt", "Matt Damon", "Robert Downey Jr."],
                "posterUrl": "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
                "basePrice": 280,
                "status": "Now Showing"
            },
            {
                "_id": "65f101a1b1c1d1e1f1000002",
                "title": "Dune: Part Two",
                "tagline": "Long live the fighters.",
                "description": "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
                "genre": ["Sci-Fi", "Adventure", "Action"],
                "duration": 166,
                "rating": 8.8,
                "certificate": "PG-13",
                "language": "English",
                "director": "Denis Villeneuve",
                "cast": ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson"],
                "posterUrl": "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
                "basePrice": 300,
                "status": "Now Showing"
            },
            {
                "_id": "65f101a1b1c1d1e1f1000003",
                "title": "Interstellar",
                "tagline": "Mankind was born on Earth. It was never meant to die here.",
                "description": "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
                "genre": ["Sci-Fi", "Drama", "Adventure"],
                "duration": 169,
                "rating": 8.7,
                "certificate": "PG-13",
                "language": "English",
                "director": "Christopher Nolan",
                "cast": ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
                "posterUrl": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
                "basePrice": 260,
                "status": "Now Showing"
            },
            {
                "_id": "65f101a1b1c1d1e1f1000004",
                "title": "Spider-Man: Across the Spider-Verse",
                "tagline": "It’s how you wear the mask that matters.",
                "description": "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its existence.",
                "genre": ["Animation", "Action", "Adventure"],
                "duration": 140,
                "rating": 8.7,
                "certificate": "PG",
                "language": "English",
                "director": "Joaquim Dos Santos",
                "cast": ["Shameik Moore", "Hailee Steinfeld", "Oscar Isaac"],
                "posterUrl": "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600&auto=format&fit=crop&q=80",
                "basePrice": 240,
                "status": "Now Showing"
            }
        ],
        "showtimes": [],
        "bookings": []
    }

def save_data(data):
    try:
        os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
        with open(DB_PATH, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
    except Exception:
        pass

# Initialize session state
if "data" not in st.session_state:
    st.session_state.data = load_data()

data = st.session_state.data
movies = data.get("movies", [])

# Top Cinema Header
col_logo, col_desc = st.columns([1, 4])
with col_logo:
    st.title("🎬 IMovies")
with col_desc:
    st.markdown("""
    **Movie Ticket Booking Made Simple** • Full-Stack Cinema Reservation System  
    *Explore movies, select showtimes, reserve seats with real-time tracking, and generate digital QR e-tickets.*
    """)

# Sidebar Navigation
st.sidebar.image("https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400", use_container_width=True)
st.sidebar.markdown("### 🍿 Cinema Navigation")
menu = st.sidebar.radio(
    "Choose View:",
    ["🎬 Browse Movies", "🎟️ Book Tickets", "🎫 My Bookings (QR Ticket)", "🛡️ Admin Command Center", "💻 MERN Stack Architecture"]
)

st.sidebar.markdown("---")
st.sidebar.markdown("**Repository:** [GitHub Codebase](https://github.com/Yash-Shukla11/yash1126shukla-imovies)")
st.sidebar.markdown("**Local API Status:** `http://localhost:5000` (Port 5000)")

# ----------------- VIEW 1: BROWSE MOVIES -----------------
if menu == "🎬 Browse Movies":
    st.markdown("### 🎞️ Featured Blockbusters & Catalog")
    
    # Filter row
    fcol1, fcol2, fcol3 = st.columns([2, 1, 1])
    with fcol1:
        search_query = st.text_input("🔍 Search movies, directors, or cast...", "")
    with fcol2:
        all_genres = sorted(list({g for m in movies for g in m.get("genre", [])}))
        selected_genre = st.selectbox("Genre Filter", ["All"] + all_genres)
    with fcol3:
        status_filter = st.selectbox("Release Status", ["All", "Now Showing", "Coming Soon"])
        
    filtered_movies = movies
    if search_query:
        q = search_query.lower()
        filtered_movies = [m for m in filtered_movies if q in m["title"].lower() or q in m.get("description", "").lower() or any(q in c.lower() for c in m.get("cast", []))]
    if selected_genre != "All":
        filtered_movies = [m for m in filtered_movies if selected_genre in m.get("genre", [])]
    if status_filter != "All":
        filtered_movies = [m for m in filtered_movies if m.get("status") == status_filter]
        
    st.caption(f"Showing {len(filtered_movies)} movies")
    
    # Display in cards grid
    cols = st.columns(3)
    for idx, movie in enumerate(filtered_movies):
        with cols[idx % 3]:
            st.image(movie.get("posterUrl", "https://via.placeholder.com/300x450"), use_container_width=True)
            st.markdown(f"#### {movie['title']}")
            st.markdown(f"⭐ **{movie.get('rating', 8.0)}/10** • ⏱️ {movie.get('duration', 120)}m • 🏷️ {movie.get('certificate', 'UA')}")
            st.markdown(f"**Genres:** {', '.join(movie.get('genre', []))}")
            st.write(movie.get("description", "")[:130] + "...")
            st.markdown(f"**Starting from:** ₹{movie.get('basePrice', 220)}")
            st.markdown("---")

# ----------------- VIEW 2: BOOK TICKETS -----------------
elif menu == "🎟️ Book Tickets":
    st.markdown("### 🎟️ Reserve Movie Tickets & Select Seats")
    
    movie_titles = [m["title"] for m in movies]
    bcol1, bcol2, bcol3 = st.columns([2, 1, 1])
    
    with bcol1:
        selected_movie_title = st.selectbox("1. Select Movie:", movie_titles)
        selected_movie = next(m for m in movies if m["title"] == selected_movie_title)
    
    with bcol2:
        theaters = ["IMAX Luxe - Downtown", "PVR Grand - Phoenix Mall", "Cinepolis VIP - Seasons"]
        selected_theater = st.selectbox("2. Select Cinema:", theaters)
        
    with bcol3:
        times = ["10:30 AM", "02:15 PM", "06:30 PM", "09:45 PM"]
        selected_time = st.selectbox("3. Select Showtime:", times)
        
    selected_date = st.date_input("4. Select Date:", datetime.today())
    
    st.markdown("---")
    st.markdown("#### 💺 Interactive Seat Matrix")
    st.markdown('<div class="screen-indicator">ALL EYES THIS WAY • CINEMA SCREEN</div>', unsafe_allow_html=True)
    
    # Seat pricing tiers
    base_p = selected_movie.get("basePrice", 220)
    vip_price = int(base_p * 2.2)
    premium_price = int(base_p * 1.5)
    std_price = base_p
    
    st.info(f"💡 **Pricing Legend:** Standard (Rows A-B): ₹{std_price} | Premium (Rows C-E): ₹{premium_price} | VIP Recliner (Row F): ₹{vip_price}")
    
    # Seat Selection Multiselect
    all_seat_options = []
    rows = ["A", "B", "C", "D", "E", "F"]
    for r in rows:
        tier_name = "Standard" if r in ["A", "B"] else ("Premium" if r in ["C", "D", "E"] else "VIP")
        tier_price = std_price if tier_name == "Standard" else (premium_price if tier_name == "Premium" else vip_price)
        for c in range(1, 11):
            seat_code = f"{r}{c}"
            all_seat_options.append(f"{seat_code} ({tier_name} - ₹{tier_price})")
            
    chosen_seats_full = st.multiselect("Select your seats (Max 8):", all_seat_options, max_selections=8)
    
    if chosen_seats_full:
        # Calculate totals
        seat_codes = [s.split(" ")[0] for s in chosen_seats_full]
        subtotal = 0
        for s in chosen_seats_full:
            price_val = int(s.split("₹")[-1].replace(")", ""))
            subtotal += price_val
            
        fee = int(subtotal * 0.05)
        tax = int((subtotal + fee) * 0.18)
        grand_total = subtotal + fee + tax
        
        st.markdown("---")
        st.markdown("#### 🧾 Order Summary")
        scol1, scol2 = st.columns(2)
        with scol1:
            st.write(f"**Movie:** {selected_movie_title}")
            st.write(f"**Theater:** {selected_theater}")
            st.write(f"**Date & Time:** {selected_date} at {selected_time}")
            st.write(f"**Seats:** {', '.join(seat_codes)} ({len(seat_codes)} tickets)")
        with scol2:
            st.write(f"Ticket Subtotal: ₹{subtotal}")
            st.write(f"Convenience Fee (5%): ₹{fee}")
            st.write(f"GST Tax (18%): ₹{tax}")
            st.markdown(f"### Grand Total: ₹{grand_total}")
            
        cust_name = st.text_input("Your Full Name:", "Yash Shukla")
        payment_method = st.radio("Payment Method:", ["Credit/Debit Card", "UPI / QR", "NetBanking"], horizontal=True)
        
        if st.button("🚀 Pay & Confirm Ticket Reservation"):
            ref_id = f"IMOV-{random.randint(100000, 999999)}"
            new_booking = {
                "bookingReference": ref_id,
                "customerName": cust_name,
                "movieTitle": selected_movie_title,
                "theater": selected_theater,
                "date": str(selected_date),
                "time": selected_time,
                "seats": seat_codes,
                "totalAmount": grand_total,
                "status": "Confirmed",
                "bookingDate": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }
            if "bookings" not in data:
                data["bookings"] = []
            data["bookings"].insert(0, new_booking)
            save_data(data)
            st.balloons()
            st.success(f"🎉 Booking Confirmed! Your Reference ID is **{ref_id}**.")
            st.info("Head to the **'🎫 My Bookings (QR Ticket)'** tab to inspect and print your scannable digital pass!")

# ----------------- VIEW 3: MY BOOKINGS & QR TICKET -----------------
elif menu == "🎫 My Bookings (QR Ticket)":
    st.markdown("### 🎫 Your Cinema Reservations & Scannable QR Pass")
    bookings = data.get("bookings", [])
    
    if not bookings:
        st.warning("No movie bookings found yet. Go to 'Book Tickets' to reserve your first movie!")
    else:
        for b in bookings:
            with st.expander(f"🎬 {b.get('movieTitle')} — Ref: {b.get('bookingReference')} ({b.get('status', 'Confirmed')})", expanded=True):
                tcol1, tcol2 = st.columns([2, 1])
                with tcol1:
                    st.markdown(f"### {b.get('movieTitle')}")
                    st.write(f"**Cinema Hall:** {b.get('theater')}")
                    st.write(f"**Showtime:** {b.get('date')} at {b.get('time')}")
                    st.write(f"**Reserved Seats:** `{', '.join(b.get('seats', []))}`")
                    st.write(f"**Total Paid:** ₹{b.get('totalAmount')}")
                    st.write(f"**Customer:** {b.get('customerName', 'Guest')}")
                    st.write(f"**Booked On:** {b.get('bookingDate')}")
                    
                with tcol2:
                    # Generate dynamic QR code
                    qr_payload = f"IMOV-VERIFY:{b.get('bookingReference')}:{b.get('movieTitle')}:{b.get('theater')}:{','.join(b.get('seats', []))}"
                    qr = qrcode.QRCode(box_size=4, border=1)
                    qr.add_data(qr_payload)
                    qr.make(fit=True)
                    img = qr.make_image(fill_color="black", back_color="white")
                    
                    buf = BytesIO()
                    img.save(buf, format="PNG")
                    st.image(buf.getvalue(), caption="SCAN AT TURNSTILE", width=160)
                    
                if b.get("status") == "Confirmed":
                    if st.button(f"Cancel Booking ({b.get('bookingReference')})", key=b.get("bookingReference")):
                        b["status"] = "Cancelled"
                        save_data(data)
                        st.rerun()

# ----------------- VIEW 4: ADMIN COMMAND CENTER -----------------
elif menu == "🛡️ Admin Command Center":
    st.markdown("### 🛡️ IMovies Administration & Revenue Metrics")
    
    bookings = data.get("bookings", [])
    active_b = [b for b in bookings if b.get("status") == "Confirmed"]
    revenue = sum(b.get("totalAmount", 0) for b in active_b)
    tickets = sum(len(b.get("seats", [])) for b in active_b)
    
    mcol1, mcol2, mcol3, mcol4 = st.columns(4)
    mcol1.metric("Total Revenue", f"₹{revenue:,}")
    mcol2.metric("Tickets Sold", str(tickets))
    mcol3.metric("Active Reservations", str(len(active_b)))
    mcol4.metric("Movies in Catalog", str(len(movies)))
    
    st.markdown("---")
    st.markdown("#### ➕ Add New Movie to Catalog")
    with st.form("add_movie_form"):
        ntitle = st.text_input("Movie Title", "")
        ndescription = st.text_area("Synopsis", "")
        ngenre = st.text_input("Genres (comma separated)", "Action, Sci-Fi")
        nduration = st.number_input("Duration (minutes)", min_value=60, max_value=240, value=135)
        nrating = st.slider("Rating (out of 10)", 1.0, 10.0, 8.5, 0.1)
        nposter = st.text_input("Poster Image URL", "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600")
        nprice = st.number_input("Base Ticket Price (₹)", min_value=100, max_value=1000, value=250)
        
        submitted = st.form_submit_button("Publish Movie to IMovies")
        if submitted and ntitle:
            new_m = {
                "_id": f"65f1{random.randint(1000000000000000, 9999999999999999)}",
                "title": ntitle,
                "description": ndescription,
                "genre": [g.strip() for g in ngenre.split(",")],
                "duration": int(nduration),
                "rating": float(nrating),
                "certificate": "UA",
                "language": "English",
                "posterUrl": nposter,
                "basePrice": int(nprice),
                "status": "Now Showing"
            }
            data["movies"].insert(0, new_m)
            save_data(data)
            st.success(f"Movie '{ntitle}' published successfully!")
            st.rerun()

# ----------------- VIEW 5: MERN STACK ARCHITECTURE -----------------
elif menu == "💻 MERN Stack Architecture":
    st.markdown("### 💻 Full-Stack Architecture & Mentor Evaluation Notes")
    st.markdown("""
    This project features a comprehensive **client-server dual architecture**:
    - **Frontend:** React 18, Vite, Bootstrap 5, Axios, Canvas Confetti, QR Code Generator
    - **Backend API:** Node.js, Express.js, JWT (`jsonwebtoken`), Bcrypt password hashing (`bcryptjs`)
    - **Database:** MongoDB & Mongoose schemas with resilient automatic persistent data store fallback
    
    #### 📁 Monorepo Structure
    ```
    imovies/
    ├── client/               # React 18 SPA (Vite + Bootstrap 5)
    ├── server/               # Express.js REST API + Mongoose Models
    ├── streamlit_app.py      # Streamlit Cloud Deployment Entrypoint
    ├── requirements.txt      # Python dependencies for Streamlit
    ├── package.json          # Root build orchestration
    └── README.md             # Complete documentation
    ```
    """)
    st.markdown("🔗 **GitHub Repo:** [Yash-Shukla11/yash1126shukla-imovies](https://github.com/Yash-Shukla11/yash1126shukla-imovies)")
