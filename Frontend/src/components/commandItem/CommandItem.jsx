import image from '../carousel/Laptop.jpeg'
import { getProducts } from '../../api/product';
import { cancelCommandById,getCommands } from '../../api/command';
import { sendCancelingConfirmation } from '../../api/email';
import { Button } from '../ui/button';
import { TrashIcon } from "lucide-react"
const CommandItem = ({ order,profile }) =>{

    console.log("order =>",order)
    return(
        <div className='border border-gray-200 p-5 rounded-sm space-y-5 '>
            <h2 className='font-bold'>Date : {order.order_date}</h2>
            <div>
                <h1 className='font-bold '>Etat de livraison produit : <span className='text-red-500'>{ order.status }</span></h1>
                <p className='text-justify'>
                    Votre commande vous sera livré le {order.delivery_planned_date} .
                </p>
            </div>
            {
                order.order_products.map((item,index)=>{
                    // Getting the whole product from products to have the image of the product
                    const product = getProducts.data.find((element)=>element.name == item.product_name)
                    console.log("product =>", product);
                    return (
                        <div key={index} className='sm:flex gap-5 border border-gray-200 p-2 rounded-xl'>
                            <div className='w-20'>
                                <img src={product.image} alt="" />
                            </div>
                            <div>
                                <h2 className='font-bold'>Nom produit : {item.product_name} </h2>
                                <p>Quantity : {item.quantity}</p>
                                <p>Unit price : {item.oneself_price} </p>
                            </div>
                        </div>
                    )
                })
            }
            <div className='flex justify-between'>
                <p className='font-bold'>prix total : {order.total_amount}</p>
                <Button 
                    className="active:scale-110 transition-transform duration-100"
                    onClick={()=>{
                        cancelCommandById(order.id)
                        .then(data=>{
                            console.log("onclick=>",data);
                            sendCancelingConfirmation(profile)
                            .then(response => {
                                console.log(response.data.status);
                                alert(`Commande annuler avec succès, un mail de confirmation vous sera envoyé`);
                            })
                            .catch(error => {
                                console.error('Erreur:', error);
                            })
                            .finally(()=>{
                                window.location.href = window.location.href;
                            });
                        })
                        .catch(error=>{
                            console.log("Error => ",error)
                        })
                    }}
                    variant="destructive" 
                >
                    <TrashIcon className="-ms-1 opacity-60 " size={16} aria-hidden="true" />
                    Cancel order
                </Button>
            </div>
        </div>
    )
}

export default CommandItem;
