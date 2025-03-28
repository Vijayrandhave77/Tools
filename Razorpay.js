import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

function Bill() {
  const [mydate, setMyDate] = useState();
  const [custdate, setCustData] = useState();
  const [cname, setCName] = useState();
  const [caddress, setCAddress] = useState();
  const [ccontact, setCContact] = useState();
  const [sitems, setSItem] = useState([]);
  const [user, setUser] = useState([]);
  const [usercid, setUsercid] = useState("");

  var total = 0;
  var nextbillid = "";
  const [ispaymentdon, SetisPaymentDone] = useState(false);

  useEffect(() => {
    const storedbill = localStorage.getItem("billPageData");
    let bill = JSON.parse(storedbill);
    setUsercid(bill.cid);
    setUser(bill.selitems);
  }, []);

  useEffect(() => {
    for (var i = 0; i < user.length; i++) {
      sitems.push(user[i]);
    }

    axios
      .get("http://localhost:9191/customer/getcustomerdetails/" + usercid)
      .then((res) => {
        setCName(res.data.CustomerName);
        setCAddress(res.data.CAddress);
        setCContact(res.data.CContact);
        mydateFun();
      })
      .catch((err) => {
        console.log(err);
      });
  }, [usercid]);

  function mydateFun() {
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let currentDate = `${day}-${month}-${year}`;
    setMyDate(currentDate);
  }

  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

 

  function SaveBill() {
    //alert(sitems.length);
    // var nextbillid =  "";

    axios
      .get("http://localhost:9191/bill/getbillid/")
      .then((res) => {
        nextbillid = parseInt(res.data[0].billid) + 1;

        const date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let currentDate = `${day}-${month}-${year}`;

        sitems.map((item) => {
          // alert(item.pid);
          var billobj = {
            billid: nextbillid,
            billdate: currentDate,
            cid: usercid,
            pid: item.pid,
          };

          axios
            .post("http://localhost:9191/bill/billsave", billobj)
            .then((res) => {
              // nextbillid =  parseInt(res.data[0].billid)+ 1;
              // alert(res.data);
            });
        });
      })
      .catch((err) => {
        // alert("outer" + err);
      });
  }

  async function displayRazorpay() {
    if (ispaymentdon == true) {
      toast.error("payment Already Done");
      return;
    } else {
      SaveBill();
      const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );

      if (!res) {
        toast.error("Razorpay SDK failed to load. Are you online?");
        return;
      }

      var myamount = total * 100;

      const result = await axios.post(
        "http://localhost:9191/payment/orders/" + myamount
      );
      if (!result) {
        toast.error("Server error .  Are you online?");
        return;
      }

      const { amount, id: order_id, currency } = result.data;
      const options = {
        key: "rzp_test_8CxHBNuMQt1Qn8",
        amount: amount.toString(),
        currency: currency,
        name: "Universal Informatics Pvt. Ltd. Indore",
        description: "Test Transaction",
        order_id: order_id,
        handler: async function (response) {
          const data = {
            orderCreationId: order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };
          // toast.success(data.razorpayPaymentId);
          const result = await axios.post(
            "http://localhost:9191/payment/success",
            data
          );
          toast.success("Message from payment gateway:- " + result.data);

          const paydetlobjdata = {
            orderCreationId: order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
            cid: usercid,
            billid: nextbillid,
            amount: amount / 100,
          };

          axios
            .post(
              "http://localhost:9191/paymentdetails/paymentdetailsave",
              paydetlobjdata
            )
            .then((res) => {
              console.log(res.data);
              if (res.data == "payment details saved successfully") {
                SetisPaymentDone(true);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        },
        prefill: {
          name: "Vijay Randhave",
          email: "vijayrandhave@gmail.com",
          contact: "7999598871",
        },
        notes: {
          address: "VR77 Indore Pvt. Ltd",
        },
        theme: {
          color: "#61dafb",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Invoice</h1>
        <p className="text-sm text-gray-500">Date: {mydate}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
          Customer Details
        </h2>
        <table className="w-full text-sm text-left">
          <tbody>
            <tr>
              <td className="py-2 font-medium text-gray-700">Customer ID:</td>
              <td className="py-2">{usercid}</td>
            </tr>
            <tr>
              <td className="py-2 font-medium text-gray-700">Name:</td>
              <td className="py-2">{cname}</td>
            </tr>
            <tr>
              <td className="py-2 font-medium text-gray-700">Address:</td>
              <td className="py-2">{caddress}</td>
            </tr>
            <tr>
              <td className="py-2 font-medium text-gray-700">Contact:</td>
              <td className="py-2">{ccontact}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
          Bill Details
        </h2>
        <table className="w-full border text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Product Name</th>
              <th className="border px-4 py-2">Price</th>
              <th className="border px-4 py-2">Photo</th>
            </tr>
          </thead>
          <tbody>
            {user.map((item) => (
              <tr key={item.pid}>
                <td className="border px-4 py-2">{item.pid}</td>
                <td className="border px-4 py-2">{item.pname}</td>
                <td className="border px-4 py-2">{item.oprice}</td>
                <td className="border px-4 py-2">
                  <img
                    src={`http://localhost:9191/product/getproductimage/${item.ppicname}`}
                    alt="Product"
                    height="50"
                    width="50"
                    className="rounded"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {user.map((item) => {
        total = total + item.oprice;
      })}
      <div className="text-right mb-6">
        <h3 className="text-lg font-bold text-gray-800">
          Total Amount: ₹{total}
        </h3>
      </div>

      <div className="text-center">
        <button
          type="submit"
          className="px-6 py-2 bg-green-500 text-white text-lg font-semibold rounded hover:bg-green-600"
          onClick={displayRazorpay}
        >
          Pay Now
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}
export default Bill;
