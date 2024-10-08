export default function Newsletter() {
  return (
    <>
      <div className="col-lg-3 col-md-6 col-12">
        <div className="single-footer">
          <h2>Newsletter</h2>
          <p>
            subscribe to our newsletter to get allour news in your inbox.. Lorem
            ipsum dolor sit amet, consectetur adipisicing elit,
          </p>
          <form
            action="mail/mail.php"
            method="get"
            className="newsletter-inner"
          >
            <input
              name="email"
              placeholder="Email Address"
              className="common-input"
              // onfocus="this.placeholder = ''"
              // onblur="this.placeholder = 'Your email address'"
              required=""
              type="email"
            />
            <button className="button">
              <i className="icofont icofont-paper-plane"></i>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
