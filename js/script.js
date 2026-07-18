/*==================================================
    SIGAP HUTAN
    Sistem Informasi Gangguan, Aduan,
    dan Pelayanan Kehutanan Terpadu
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

    /*=========================================
        NAVBAR SCROLL
    =========================================*/

    const navbar = document.querySelector(".navbar");

    window.addEventListener("scroll", () => {

        if (navbar) {

            if (window.scrollY > 80) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }

        }

    });

    /*=========================================
        SMOOTH SCROLL
    =========================================*/

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", function (e) {

            const target = document.querySelector(this.getAttribute("href"));

            if (target) {

                e.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        });

    });

    /*=========================================
        ACTIVE MENU
    =========================================*/

    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".navbar .nav-link");

    window.addEventListener("scroll", () => {

        let current = "";

        sections.forEach(section => {

            const top = section.offsetTop - 120;
            const height = section.offsetHeight;

            if (window.scrollY >= top &&
                window.scrollY < top + height) {

                current = section.getAttribute("id");

            }

        });

        navLinks.forEach(link => {

            link.classList.remove("active");

            if (link.getAttribute("href") === "#" + current) {

                link.classList.add("active");

            }

        });

    });

    /*=========================================
        COUNTER ANIMATION
    =========================================*/

    const counters = document.querySelectorAll(".counter");

    counters.forEach(counter => {

        const target = Number(counter.dataset.target);

        let current = 0;

        const speed = target / 100;

        const updateCounter = () => {

            if (current < target) {

                current += speed;

                counter.innerText = Math.ceil(current);

                requestAnimationFrame(updateCounter);

            } else {

                counter.innerText = target.toLocaleString("id-ID");

            }

        };

        updateCounter();

    });

    /*=========================================
        BACK TO TOP
    =========================================*/

    const backTop = document.createElement("button");

    backTop.id = "backToTop";

    backTop.innerHTML = '<i class="bi bi-arrow-up"></i>';

    document.body.appendChild(backTop);

    backTop.style.cssText = `
        position:fixed;
        right:25px;
        bottom:25px;
        width:50px;
        height:50px;
        border:none;
        border-radius:50%;
        background:#198754;
        color:#fff;
        font-size:22px;
        cursor:pointer;
        display:none;
        z-index:999;
        box-shadow:0 8px 20px rgba(0,0,0,.25);
        transition:.3s;
    `;

    window.addEventListener("scroll", () => {

        if (window.scrollY > 400) {

            backTop.style.display = "block";

        } else {

            backTop.style.display = "none";

        }

    });

    backTop.addEventListener("click", () => {

        window.scrollTo({

            top: 0,
            behavior: "smooth"

        });

    });

    /*=========================================
        CARD HOVER
    =========================================*/

    document.querySelectorAll(".card").forEach(card => {

        card.addEventListener("mouseenter", () => {

            card.style.transform = "translateY(-8px)";

        });

        card.addEventListener("mouseleave", () => {

            card.style.transform = "translateY(0px)";

        });

    });

    /*=========================================
        LOADING EFFECT
    =========================================*/

    document.body.classList.add("loaded");

});

/*=========================================
    CONSOLE
=========================================*/

console.log("%cSIGAP HUTAN", "color:green;font-size:18px;font-weight:bold;");
console.log("Sistem Informasi Gangguan, Aduan, dan Pelayanan Kehutanan Terpadu");
console.log("UPTD KPH Wilayah VIII Aceh");
console.log("Website berhasil dimuat.");
/*=========================================
    FADE ANIMATION
=========================================*/

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if(entry.isIntersecting){

            entry.target.classList.add("fade-up");

        }

    });

},{
    threshold:0.2
});

document.querySelectorAll("section").forEach(section=>{

    observer.observe(section);

});
