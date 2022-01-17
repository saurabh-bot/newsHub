import React, { useEffect, useState } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";


const News = (props) => {

    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);

        const capitalizeFirstLetter = (str) => {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }
       
        const updateNews = async () => {
            console.log(page);
            props.setProgress(10);
            let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${process.env.REACT_APP_API_KEY}&page=${page}&pageSize=${props.pageSize}`;
            setLoading(true);
            props.setProgress(30);
            let data = await fetch(url);
            props.setProgress(50);
            let parsedData = await data.json();
            console.log(parsedData)
            setArticles(parsedData.articles);
            setLoading(false);
            setTotalResults(parsedData.totalResults);
            props.setProgress(100);
            
        }

        useEffect(()=>{
            document.title = `${capitalizeFirstLetter(props.category)} - NewsMonkey`;
            updateNews();
        }, []);   // empty array so that it run only once

        const fetchMoreData = async () => {
            console.log(page);
            console.log('page', page);
            let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${process.env.REACT_APP_API_KEY}&page=${page+1}&pageSize=${props.pageSize}`;
            setPage(page+1);
            let data = await fetch(url);
            let parsedData = await data.json()
            setArticles(articles.concat(parsedData.articles))
            setTotalResults(parsedData.totalResults)
            console.log(page);
        }
    
        return (<>
                <div className="text-center" style={{margin: '100px 0px 40px 0px'}}>
                    <h2>NewsHub - Top {capitalizeFirstLetter(props.category)} Headlines</h2>
                </div>
                {loading && <Spinner/>}
                <InfiniteScroll
                    dataLength={articles.length}
                    next={fetchMoreData}
                    hasMore={articles.length !== totalResults}
                    loader={<Spinner/>}
                >
                <div className="container my-3">
                <div className="row">
                {articles.map((element) => {
                    return <div className="col-md-4" key={element.url}>
                    <NewsItem title={element.title} description={element.description} imageUrl={element.urlToImage}
                    date={element.publishedAt} newsUrl={element.url} source={element.source.name}/>
                </div>
                })}  
                </div>
                </div>
                </InfiniteScroll>
                {/* <div className="container d-flex justify-content-between mt-6">
                    <button disabled={page<=1} type="button" onClick={handlePrevClick} className="btn btn-dark btn-sm">&larr; Previous</button>
                    <button disabled={page+1>Math.ceil(totalResults/props.pageSize)} type="button" onClick={handleNextClick} className="btn btn-dark btn-sm">Next &rarr;</button>
                </div> */}
                </>
        )
    
}

News.defaultProps = {
    country: 'in',
    pageSize: 10,
    category: 'general'
}

News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string
}

export default News;
