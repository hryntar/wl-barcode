import {Html5Qrcode} from "html5-qrcode";

let toastElement = null;

function showToast(message, type) {
   if (!toastElement) {
      toastElement = document.createElement("div");
      toastElement.style.position = "fixed";
      toastElement.style.top = "-50px";
      toastElement.style.left = "50%";
      toastElement.style.transform = "translateX(-50%)";
      toastElement.style.padding = "10px";
      toastElement.style.fontSize = "14px";
      toastElement.style.borderRadius = "5px";
      toastElement.style.border = "2px solid #000";
      toastElement.style.backgroundColor = "#fff";
      toastElement.style.opacity = "1";
      toastElement.style.transition = "all 0.3s ease";

      document.body.appendChild(toastElement);
   }

   toastElement.textContent = message;

   if (type === "success") {
      toastElement.style.borderColor = "#4caf50";
   } else if (type === "error") {
      toastElement.style.borderColor = "#f44336";
   } 

   setTimeout(() => {
      toastElement.style.top = "20px"; 
      toastElement.style.opacity = "1";
   }, 100); 

   setTimeout(() => {
      toastElement.style.top = "-50px"; 
      toastElement.style.opacity = "0";
      toastElement.style.visibility = "hidden";
   }, 3000);
}

export class BarcodeScanner {
   constructor(accessToken, tenant, customerRef) {
      this.html5QRcode = new Html5Qrcode("reader");
      this.config = {
         fps: 10,
         qrbox: { width: 200, height: 100 },
      };
      this.accessToken = accessToken;
      this.tenant = tenant;
      this.customerRef = customerRef;
      this.wishlistId = null;
      this.customerId = null;

      const readerWrapper = document.getElementById("reader-wrapper");
      readerWrapper.style.width = "100%";
      readerWrapper.style.position = "absolute";
      readerWrapper.style.top = "0";
      readerWrapper.style.left = "0";
      readerWrapper.style.display = "none";
      
      this.init(); 
   } 

   async init() {
      await this.getCustomerId();
      await this.getWishlistId();
   }

   async getCustomerId() {
      try {
         const response = await fetch(`https://api.au-aws.thewishlist.io/services/customerservice/api/v2/customers/${this.customerRef}/ref`, {
            method: "GET",
            headers: {
               "X-TWC-Tenant": this.tenant,
               "authorization": `Bearer ${this.accessToken}`,
            },
         });
         const data = await response.json();
         this.customerId = data.id;

      } catch (error) {
         showToast("Failed to get customer ID", "error");
         console.error("Error fetching customerId:", error);
      }
   }

   async getWishlistId() {
      try {
         const response = await fetch(`https://api.au-aws.thewishlist.io/services/wsservice/api/wishlists/lookup?customerId=${this.customerId}`, {
            method: "GET",
            headers: {
               "X-TWC-Tenant": this.tenant,
               "authorization": `Bearer ${this.accessToken}`,
            },
         });
   
         if (response.status === 404) {
            const errorData = await response.json();
            if (errorData.status && errorData.status === "NOT_FOUND") {
               await this.createWishlist();
               return;
            }
         }
   
         const data = await response.json();
   
         if (data.wishlist && data.wishlist.length > 0) {
            const oldestWishlist = data.wishlist.reduce((oldest, current) => {
               return new Date(current.createdTime) < new Date(oldest.createdTime) ? current : oldest;
            }, data.wishlist[0]);
   
            this.wishlistId = oldestWishlist.id;
            console.log('Oldest wishlistId:', this.wishlistId);
         } else {
            await this.createWishlist();
         }
   
      } catch (error) {
         showToast("Failed to get wishlist", "error");
         console.error("Error fetching wishlistRef:", error);
      }
   }
   
   async createWishlist() {
      try {
         const response = await fetch(`https://api.au-aws.thewishlist.io/services/wsservice/api/wishlists`, {
            method: "POST",
            headers: {
               "X-TWC-Tenant": this.tenant,
               "authorization": `Bearer ${this.accessToken}`,
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               customerId: this.customerId,
               name: "tests",
            }),
         });
   
         const data = await response.json();
         this.wishlistId = data.id;
         console.log('New wishlistId:', this.wishlistId);
      } catch (error) {
         showToast("Failed to create wishlist", "error");
         console.error("Error creating wishlist:", error);
      }
   }

   async scanBarcode() {
      document.getElementById("reader-wrapper").style.display = "block";
      return new Promise(async (resolve, reject) => {
         const qrCodeSuccessCallback = async (decodedText) => {
            if (decodedText) {
               this.html5QRcode.stop();
               try {
                  const productResponse = await fetch(`https://api.au-aws.thewishlist.io/services/productsvc/api/v2/products/variants/${decodedText}/byBarcode`, {
                     method: "GET",
                     headers: {
                        "x-twc-tenant": this.tenant,
                        "authorization": `Bearer ${this.accessToken}`,
                     },
                  }); 
                  const productData = await productResponse.json();
                  await fetch(`https://api.au-aws.thewishlist.io/services/wsservice/api/wishlist/items`, {
                     method: "POST",
                     headers: {
                        "accept": "application/json, text/plain, */*",
                        "content-type": "application/json",
                        "authorization": `Bearer ${this.accessToken}`,
                        "x-twc-tenant": this.tenant
                     },
                     body: JSON.stringify({
                        product: {
                          productRef: productData.baseProductRef,
                          selectedVariantRef: productData.productRef,
                        },
                        wishlistId: this.wishlistId,
                      })
                  });
                  showToast("Product added to wishlist", "success"); 
                  resolve(productData);
               } catch (error) {
                  showToast("Failed to add product to wishlist", "error"); 
                  reject(error);
               }
            }
         };
         this.html5QRcode.start({ facingMode: "environment" }, this.config, qrCodeSuccessCallback);
      });
   }
}

